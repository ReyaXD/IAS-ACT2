# DefendNet / Unguided Challenge Worksheet

Welcome to the Advanced Cybersecurity Challenge. You have successfully patched a vulnerable university portal in the past with strict guidance. 

Now, you are on your own.

You have been handed the source code for the "Grading Management System". The development team rushed this product out the door. It contains exactly **20 major vulnerabilities** mapped to the OWASP Top 10. 

Your job is to read the code, find the flaws, exploit them to verify, and write the secure patches. Use the previous `bcrypt-auth-system` assignment as your reference guide.

---

## 🛑 How to Document Your Findings
When you find a vulnerability and are ready to patch it, you must leave a comment directly in `server.js` above your fix.
```javascript
// [VULNERABILITY FOUND] - SQL Injection
// This allowed attackers to bypass login. I fixed it by parameterizing the query using ? placeholders.
// db.query(old_code...) // REMOVED
db.query('SELECT * FROM users WHERE username = ?', [username], ...);
```

---

## 📋 The Vulnerability Checklist
Use this conceptual checklist to track your progress. The locations of these flaws are hidden across the application's endpoints (`server.js`) and its frontend files.

### Injection & Input Flaws
- [ ] **SQL Injection 1**: A login bypass allowing access to admin data.
- [ ] **SQL Injection 2**: A data exfiltration flaw leaking all courses using wildcards.
- [ ] **Command Injection**: An administrative diagnostic tool passing user input directly into a system shell.
- [ ] **Path Traversal (LFI)**: A file download feature allowing directory escape (e.g. `../../`).

### Cross-Site Scripting (XSS)
- [ ] **Stored XSS**: A discussion board that permanently saves malicious JavaScript payloads in the database.
- [ ] **Reflected XSS**: A search feature that echoes active payloads directly back into the HTML response.

### Broken Access Control & Privilege Flaws
- [ ] **Insecure Direct Object Reference (IDOR)**: A feature allowing users to view other students' records simply by modifying a URL parameter or ID constraint.
- [ ] **Privilege Escalation (Mass Assignment)**: An profile update endpoint blindly trusting hidden fields sent by the client.
- [ ] **Unrestricted File Upload**: An assignment drop-box that permits the upload of dangerous executable scripts alongside valid documents.

### Broken Authentication & Cryptography
- [ ] **Insecure Password Storage**: A database configuration that violates modern hashing standards.
- [ ] **Broken Authentication (Authorization Bypass)**: An API endpoint that assumes the user is logged in without actually checking the session securely.
- [ ] **Insecure Cookies**: A session management configuration lacking essential security flags (HttpOnly, Secure).
- [ ] **Missing Rate Limiting**: An authentication endpoint that will happily accept a brute-force dictionary attack.

### Misconfiguration & SSRF
- [ ] **Security Misconfiguration (Information Exposure)**: An improper error handling routine that leaks internal database architectural secrets directly to the client.
- [ ] **Server-Side Request Forgery (SSRF)**: A cloud curriculum fetcher that acts as an open proxy into internal private networks.
- [ ] **Cross-Site Request Forgery (CSRF)**: A state-changing endpoint lacking a unique validation token.
- [ ] **Insecure CORS**: A global configuration flag leaving the API open to any domain in the world.
- [ ] **Unvalidated Redirect**: A continue URL allowing a hacker to successfully execute a redirect-phishing attack.
- [ ] **Direct Data Exposure**: An internal admin API leaking everything to the frontend over JSON without any parameter filtering.

---
*Good luck. The fate of the university's data security rests in your hands.*
