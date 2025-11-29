--
-- Очищення таблиць
--
TRUNCATE TABLE public.work_sessions RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.work_days RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.employees RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.users RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.workplaces RESTART IDENTITY CASCADE;

--
-- 1. Вставка Юзерів
--
INSERT INTO public.users (id, first_name, last_name, email, password, is_active, is_superuser, created_at, updated_at)
VALUES
(1, 'Степан', 'Петренко', 'admin@admin.com', '$argon2id$v=19$m=65536,t=3,p=4$REhp7R1DCAFASCkFYKw1Rg$8RcRqkvoylm5qcL3m48P4dCj/CHXlWDrqtxwo34DkL0', true, true, NOW(), NOW()),
(2, 'Vitalii', 'Parkhomchuk', 'vitalii@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$Solxzvl/b621do6xttZaCw$DSAL8lmWaTcJIMxAi1cn+yXsOjZZ9u7QqIyYPxRO2dg', true, false, NOW(), NOW());

SELECT setval('public.users_id_seq', (SELECT MAX(id) FROM public.users));

--
-- 2. Вставка Workplace
--
INSERT INTO public.workplaces (id, title, address)
VALUES (1, 'Головний Офіс', 'Київ, вул. Хрещатик, 1');

SELECT setval('public.workplaces_id_seq', (SELECT MAX(id) FROM public.workplaces));

--
-- 3. Вставка Емплоєрів (спочатку без токенів, токени згенеруємо нижче)
--
INSERT INTO public.employees (first_name, last_name, position, email, phone_number, is_active, user_id, workplace_id, profile_photo, created_at, updated_at)
VALUES
('Олександр', 'Коваль', 'Backend Dev', 'alex.koval@example.com', '+380991111111', true, 2, 1, '/static/default.jpg', NOW(), NOW()),
('Марія', 'Шевченко', 'Designer', 'maria.shev@example.com', '+380992222222', true, 2, 1, '/static/default.jpg', NOW(), NOW()),
('Дмитро', 'Бондаренко', 'Frontend Dev', 'dima.bond@example.com', '+380993333333', true, 2, 1, '/static/default.jpg', NOW(), NOW()),
('Анна', 'Ткаченко', 'QA Engineer', 'anna.tkach@example.com', '+380994444444', true, 2, 1, '/static/default.jpg', NOW(), NOW()),
('Іван', 'Мельник', 'DevOps', 'ivan.melnyk@example.com', '+380995555555', true, 2, 1, '/static/default.jpg', NOW(), NOW()),
('Юлія', 'Бойко', 'HR Manager', 'julia.boyko@example.com', '+380996666666', true, 2, 1, '/static/default.jpg', NOW(), NOW()),
('Сергій', 'Кравченко', 'Fullstack Dev', 'sergey.krav@example.com', '+380997777777', true, 2, 1, '/static/default.jpg', NOW(), NOW()),
('Ольга', 'Лисенко', 'Project Manager', 'olga.lys@example.com', '+380998888888', true, 2, 1, '/static/default.jpg', NOW(), NOW());

SELECT setval('public.employees_id_seq', (SELECT MAX(id) FROM public.employees));

--
-- 4. Генерація Токенів та Історії роботи
--
DO $$
DECLARE
    emp_rec RECORD;
    curr_date DATE;
    start_date DATE := CURRENT_DATE - INTERVAL '1 year';
    end_date DATE := CURRENT_DATE;

    -- Змінні для токенів
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    token_part1 TEXT;
    token_part2 TEXT;
    final_token TEXT;

    -- Змінні для часу
    random_hours INT;
    random_minutes INT;
    total_interval INTERVAL;
    session_start TIMESTAMP WITH TIME ZONE;
    session_end TIMESTAMP WITH TIME ZONE;
    new_work_day_id INT;
    should_work BOOLEAN;
BEGIN
    -- Цикл по працівниках Віталія
    FOR emp_rec IN SELECT id FROM public.employees WHERE user_id = 2 LOOP

        -- === ГЕНЕРАЦІЯ ТОКЕНА ===
        -- Генеруємо перші 20 символів
        token_part1 := array_to_string(array(
            SELECT substr(chars, ((random() * (length(chars) - 1) + 1)::integer), 1)
            FROM generate_series(1, 20)
        ), '');

        -- Генеруємо останні 20 символів
        token_part2 := array_to_string(array(
            SELECT substr(chars, ((random() * (length(chars) - 1) + 1)::integer), 1)
            FROM generate_series(1, 20)
        ), '');

        -- Склеюємо: Part1 + ID + Part2
        final_token := token_part1 || emp_rec.id::text || token_part2;

        -- Оновлюємо працівника
        UPDATE public.employees SET personal_token = final_token WHERE id = emp_rec.id;

        -- === ГЕНЕРАЦІЯ ЧАСУ (Work History) ===
        curr_date := start_date;
        WHILE curr_date <= end_date LOOP
            -- Пн-Пт + 10% шанс пропуску
            should_work := (EXTRACT(ISODOW FROM curr_date) < 6) AND (random() > 0.10);

            IF should_work THEN
                random_hours := floor(random() * (9 - 6 + 1) + 6)::int; -- 6-9 годин
                random_minutes := floor(random() * 60)::int;
                total_interval := make_interval(hours := random_hours, mins := random_minutes);

                INSERT INTO public.work_days (work_date, employee_id, total_duration)
                VALUES (curr_date, emp_rec.id, total_interval)
                RETURNING id INTO new_work_day_id;

                -- Старт роботи між 8:00 і 10:00
                session_start := (curr_date + make_interval(hours := floor(random() * (10-8+1) + 8)::int)) AT TIME ZONE 'UTC';
                session_end := session_start + total_interval;

                INSERT INTO public.work_sessions (work_day_id, start_time, end_time)
                VALUES (new_work_day_id, session_start, session_end);
            END IF;

            curr_date := curr_date + 1;
        END LOOP;

    END LOOP;
END $$;

-- Оновлення лічильників
SELECT setval('public.work_days_id_seq', (SELECT MAX(id) FROM public.work_days));
SELECT setval('public.work_sessions_id_seq', (SELECT MAX(id) FROM public.work_sessions));