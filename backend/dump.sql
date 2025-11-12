INSERT INTO users (first_name, last_name, email, password, is_active, is_superuser, created_at, updated_at)
VALUES (
    'Степан',
    'Петренко',
    'admin@admin.com',
    '$argon2id$v=19$m=65536,t=3,p=4$REhp7R1DCAFASCkFYKw1Rg$8RcRqkvoylm5qcL3m48P4dCj/CHXlWDrqtxwo34DkL0',
    TRUE,
    TRUE,
    NOW(),
    NOW()
);
