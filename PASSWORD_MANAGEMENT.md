# Password Management & Security Guide

## Overview
This document outlines the password management system, security measures, and operational procedures for the "I Need Numbers" application.

## Password Security Features

### 1. Password Hashing
- **Algorithm**: Argon2id (industry standard, OWASP recommended)
- **Parameters**:
  - Time cost: 4 iterations
  - Memory cost: 65536 KB (64MB)
  - Parallelism: 1 thread
  - Hash length: 32 bytes
  - Salt length: 16 bytes

### 2. Password Requirements
- **Minimum length**: 8 characters
- **Recommended**: Mix of uppercase, lowercase, numbers, and special characters
- **Storage**: Never stored in plain text
- **Transmission**: Only over HTTPS

### 3. Migration Support
- Backward compatibility with bcrypt hashes
- Automatic migration to Argon2id on successful login
- Logged in audit trail

## Password Reset Flow

### For Users (Self-Service)

#### Step 1: Request Reset
```
POST /api/auth/password-reset
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link has been sent.",
  "dev_reset_token": "token_here" // Only in development mode
}
```

**Security Features:**
- Always returns success (prevents email enumeration)
- Token valid for 1 hour
- Secure random token (32 bytes, URL-safe)
- Stored in database with expiration timestamp

#### Step 2: Confirm Reset
```
POST /api/auth/password-reset/confirm
{
  "token": "reset_token_from_email",
  "new_password": "new_secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully..."
}
```

**Security Features:**
- Token validation
- Expiration check
- Token destroyed after use
- Audit log created

### For Admins (User Password Reset)

#### Admin Reset User Password
```
POST /admin/users/{user_id}/reset-password
Authorization: Bearer {admin_token}
{
  "new_password": "temporary_password",
  "reason": "User requested password reset"
}
```

**Security Features:**
- Requires `master_admin` role
- Enhanced audit logging (who, what, when)
- Logs include admin user details
- TODO: Email notification to user (not yet implemented)

## Audit Logging

### Events Logged
1. `PASSWORD_RESET_REQUEST` - User requests password reset
2. `PASSWORD_RESET_CONFIRM` - User successfully resets password
3. `PASSWORD_CHANGE` - User changes password (logged in)
4. `admin_password_reset` - Admin resets user password
5. `LOGIN` - Failed login attempts (wrong password)

### Audit Log Structure
```json
{
  "user_id": "user_uuid",
  "user_email": "user@example.com",
  "action": "password_reset_request",
  "timestamp": "2025-10-21T17:00:00Z",
  "ip_address": "192.168.1.1",
  "metadata": {
    "method": "email",
    "success": true
  }
}
```

### Admin Password Reset Audit
```json
{
  "user_id": "target_user_uuid",
  "user_email": "target@example.com",
  "action": "admin_password_reset",
  "admin_user_id": "admin_uuid",
  "admin_user_email": "admin@example.com",
  "timestamp": "2025-10-21T17:00:00Z",
  "ip_address": "192.168.1.1",
  "metadata": {
    "target_user_email": "target@example.com",
    "reset_by_admin": "admin@example.com",
    "reset_reason": "User forgot password"
  }
}
```

## Operational Procedures

### Password Reset Troubleshooting

#### Issue: User Can't Log In
1. **Check if user exists**:
   ```bash
   mongosh test_database --eval "db.users.findOne({email: 'user@example.com'})"
   ```

2. **Verify account status**:
   - Check `plan` field (FREE users cannot log in)
   - Check if account is active

3. **Reset password via admin**:
   - Use Admin Console → Users → Reset Password
   - Or use API endpoint with master_admin credentials

4. **Check audit logs**:
   ```bash
   mongosh test_database --eval "db.audit_logs.find({user_email: 'user@example.com'}).sort({timestamp: -1}).limit(10)"
   ```

### Security Incident Response

#### Compromised Password Detected
1. **Immediate Actions**:
   - Reset user password
   - Force logout (invalidate session)
   - Check audit logs for suspicious activity
   - Notify user via email

2. **Investigation**:
   - Review recent login attempts
   - Check for unusual IP addresses
   - Look for pattern of failed logins
   - Check other accounts from same IP

3. **Documentation**:
   - Log incident in audit trail
   - Update security incident log
   - Notify security team if needed

## Production Checklist

### Before Going Live

- [x] Argon2id password hashing implemented
- [x] Password reset flow completed
- [x] Admin password reset with audit logging
- [x] CSRF protection configured
- [ ] Email service integration (currently logs to console)
- [ ] Email notifications for password resets
- [ ] Rate limiting on password reset requests
- [ ] Account lockout after failed attempts
- [ ] Password strength meter on frontend
- [ ] Security questions or 2FA for high-value accounts

### Email Integration (TODO)

When implementing email service:

1. **Choose Provider**: SendGrid, AWS SES, or Postmark
2. **Email Template**: Create branded password reset email
3. **Update Backend**:
   ```python
   # In request_password_reset function
   await send_password_reset_email(
       to_email=user['email'],
       reset_link=f"{frontend_url}/auth/reset-password?token={reset_token}",
       expires_in_hours=1
   )
   ```
4. **Security**: Use DKIM, SPF, and DMARC records
5. **Monitoring**: Track email delivery rates

### Monitoring & Alerts

#### Metrics to Monitor
- Password reset requests per hour
- Failed login attempts per user
- Admin password reset frequency
- Time between resets (detect abuse)
- Token expiration rates

#### Alert Thresholds
- **High Priority**:
  - 10+ failed logins in 5 minutes (brute force)
  - Admin resets same user 3+ times in 24 hours
  - Password reset tokens not expiring (data issue)

- **Medium Priority**:
  - 50+ password reset requests per hour
  - High rate of expired token usage attempts

## API Reference

### User Endpoints

#### Request Password Reset
```
POST /api/auth/password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Confirm Password Reset
```
POST /api/auth/password-reset/confirm
Content-Type: application/json

{
  "token": "secure_reset_token",
  "new_password": "new_secure_password123!"
}
```

#### Change Password (Logged In)
```
POST /api/auth/change-password
Authorization: Bearer {jwt_token}
Cookie: access_token={jwt_token}

{
  "current_password": "current_password",
  "new_password": "new_secure_password123!"
}
```

### Admin Endpoints

#### Reset User Password
```
POST /admin/users/{user_id}/reset-password
Authorization: Bearer {admin_jwt_token}
Cookie: access_token={admin_jwt_token}

{
  "new_password": "temporary_password123!",
  "reason": "User forgot password and contacted support"
}
```

## Best Practices

### For Developers
1. Never log passwords (even hashed)
2. Always use parameterized queries
3. Implement rate limiting
4. Use HTTPS everywhere
5. Validate all inputs
6. Keep dependencies updated

### For Admins
1. Never share admin credentials
2. Use strong passwords for admin accounts
3. Enable 2FA on admin accounts
4. Log all password reset actions
5. Verify user identity before resetting
6. Use temporary passwords when resetting

### For Users
1. Use unique passwords for each service
2. Enable 2FA when available
3. Don't share passwords
4. Change password if suspicious activity
5. Use password manager

## Compliance

### Data Protection
- GDPR: User can request password data deletion
- CCPA: Audit logs kept for 90 days
- PCI-DSS: Passwords never stored in plain text
- SOC 2: Audit trail for all password changes

### Password Policy
- Enforced minimum length
- No common passwords (TODO: implement check)
- Password expiry: 365 days (recommended, not enforced)
- Password history: Last 5 passwords (TODO: implement)

## Recovery Procedures

### Lost Admin Access
If all admins lose access:

1. **Database Access Required**:
   ```bash
   # Create temporary admin with known password
   mongosh test_database
   
   # Hash a temporary password
   python3 -c "from app.security_modules.password import hash_password; print(hash_password('TempAdmin123!'))"
   
   # Update admin user
   db.users.updateOne(
     {email: "admin@ineedumbers.com"},
     {$set: {
       hashed_password: "hash_from_above",
       password_changed_at: new Date().toISOString()
     }}
   )
   ```

2. **Log the action** for audit purposes
3. **Force password change** on first login
4. **Review security** after regaining access

## Future Enhancements

### Planned Features
- [ ] Passwordless authentication (magic links)
- [ ] Social login integration
- [ ] Biometric authentication support
- [ ] Password strength scoring
- [ ] Breach detection (Have I Been Pwned integration)
- [ ] Multi-factor authentication (TOTP, SMS, WebAuthn)
- [ ] Session management improvements
- [ ] Account recovery via security questions

### Under Consideration
- [ ] Zero-knowledge password management
- [ ] Hardware security key support (YubiKey)
- [ ] Adaptive authentication based on risk
- [ ] Continuous authentication monitoring

---

**Last Updated**: October 21, 2025
**Maintainer**: Development Team
**Review Schedule**: Quarterly
