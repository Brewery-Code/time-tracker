--
-- PostgreSQL database dump
--

\restrict kqylHkER740CksuJMTGwa4c3c7cNPYJOAvV6zKjfwij2Cs61xf8gV9Gh1Aim98x

-- Dumped from database version 18.0 (Debian 18.0-1.pgdg13+3)
-- Dumped by pg_dump version 18.0 (Debian 18.0-1.pgdg13+3)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: john
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO john;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: john
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    phone_number character varying(13) NOT NULL,
    is_active boolean NOT NULL,
    personal_token character varying(255),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id integer NOT NULL,
    workplace_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    "position" character varying(50) NOT NULL,
    profile_photo character varying(100)
);


ALTER TABLE public.employees OWNER TO john;

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: john
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO john;

--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: john
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: john
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying NOT NULL,
    password character varying(255) NOT NULL,
    is_active boolean NOT NULL,
    is_superuser boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO john;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: john
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO john;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: john
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: work_days; Type: TABLE; Schema: public; Owner: john
--

CREATE TABLE public.work_days (
    id integer NOT NULL,
    work_date date NOT NULL,
    employee_id integer NOT NULL,
    total_duration interval DEFAULT '00:00:00'::interval NOT NULL
);


ALTER TABLE public.work_days OWNER TO john;

--
-- Name: work_days_id_seq; Type: SEQUENCE; Schema: public; Owner: john
--

CREATE SEQUENCE public.work_days_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_days_id_seq OWNER TO john;

--
-- Name: work_days_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: john
--

ALTER SEQUENCE public.work_days_id_seq OWNED BY public.work_days.id;


--
-- Name: work_sessions; Type: TABLE; Schema: public; Owner: john
--

CREATE TABLE public.work_sessions (
    id integer NOT NULL,
    work_day_id integer NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone
);


ALTER TABLE public.work_sessions OWNER TO john;

--
-- Name: work_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: john
--

CREATE SEQUENCE public.work_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_sessions_id_seq OWNER TO john;

--
-- Name: work_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: john
--

ALTER SEQUENCE public.work_sessions_id_seq OWNED BY public.work_sessions.id;


--
-- Name: workplaces; Type: TABLE; Schema: public; Owner: john
--

CREATE TABLE public.workplaces (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    address character varying(100) NOT NULL
);


ALTER TABLE public.workplaces OWNER TO john;

--
-- Name: workplaces_id_seq; Type: SEQUENCE; Schema: public; Owner: john
--

CREATE SEQUENCE public.workplaces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workplaces_id_seq OWNER TO john;

--
-- Name: workplaces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: john
--

ALTER SEQUENCE public.workplaces_id_seq OWNED BY public.workplaces.id;


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: work_days id; Type: DEFAULT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.work_days ALTER COLUMN id SET DEFAULT nextval('public.work_days_id_seq'::regclass);


--
-- Name: work_sessions id; Type: DEFAULT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.work_sessions ALTER COLUMN id SET DEFAULT nextval('public.work_sessions_id_seq'::regclass);


--
-- Name: workplaces id; Type: DEFAULT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.workplaces ALTER COLUMN id SET DEFAULT nextval('public.workplaces_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: john
--

COPY public.alembic_version (version_num) FROM stdin;
cf4d62c9c796
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: john
--

COPY public.employees (id, email, phone_number, is_active, personal_token, created_at, updated_at, user_id, workplace_id, first_name, last_name, "position", profile_photo) FROM stdin;
3	vitalii_chuvak@gmail.com	+380950919207	t	DFqu4lhakSLkbGVbnrrg3oqa1PCMrKbvgA0q2yAEJ	2025-11-18 14:26:25.947514+00	2025-11-18 14:26:25.958055+00	3	1	Vitalii	Parkhomchuk	Front-end developer	/static/employees/profile_photos/6e9e9e2b-e4c2-4347-92ac-ed4e6604d49d.jpg
4	john.doe@example.com	+380931234567	t	RudKoR3nKzRdSC2Y1u1S4q4Y4m5z5RpzYzuJIkfFg	2025-11-29 16:03:24.917414+00	2025-11-29 16:03:24.939691+00	2	1	John	Doe	Manager	/static/employees/profile_photos/b11de719-9db9-47d8-a0ff-94cef0fbb181.jpg
6	john1.doe@example.com	+380934234567	t	VnuDtaJvRXxVMcWJ5FKg6jzVlsmF4qYC702nPvPxR	2025-11-29 17:23:52.624925+00	2025-11-29 17:23:52.637442+00	2	1	John	Doe	Manager	/static/employees/profile_photos/203b7710-e4a9-4383-b12e-b0b172b469cc.jpg
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: john
--

COPY public.users (id, first_name, last_name, email, password, is_active, is_superuser, created_at, updated_at) FROM stdin;
1	Степан	Петренко	admin@admin.com	$argon2id$v=19$m=65536,t=3,p=4$REhp7R1DCAFASCkFYKw1Rg$8RcRqkvoylm5qcL3m48P4dCj/CHXlWDrqtxwo34DkL0	t	t	2025-11-12 10:04:34.62642+00	2025-11-12 10:04:34.62642+00
2	Vitalii	Parkhomchuk	vitalii@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$Solxzvl/b621do6xttZaCw$DSAL8lmWaTcJIMxAi1cn+yXsOjZZ9u7QqIyYPxRO2dg	t	f	2025-11-12 10:10:58.723059+00	2025-11-12 10:10:58.723059+00
3	Ivan	Drozd	ivan1@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$1jpnjHEuhfD+fy8lJIRQSg$UASnz9J0+j96UEoDtDREkt5P4HJg6nl/VRyiT6kLhjU	t	f	2025-11-18 14:16:26.338154+00	2025-11-18 14:16:26.338154+00
4	Sasha	Endrok	sasha@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$P2cMgdD6n/M+Z4yRMuYcYw$O3O6id4qJj1D15WArA7nWcRrU6+FjrpleJN1RRL+b0U	t	f	2025-11-22 20:07:47.845174+00	2025-11-22 20:07:47.845174+00
5	Sasha	Endrok	sasha1@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$/z+n1NobIyREiBFCKMWY0w$a27wsIrUI3K05Xyaoh4FnuIlkzQ0c0DZvTt/3cjwmiI	t	f	2025-11-22 20:11:30.190575+00	2025-11-22 20:11:30.190575+00
6	Sasha	Endrok	sasha11@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$vLc2pjQGAGAMQSjlfG8N4Q$a9eQHEZJskD49WeVisljBdtCw70chKwjNuOvRLg8QMw	t	f	2025-11-22 20:12:02.304257+00	2025-11-22 20:12:02.304257+00
\.


--
-- Data for Name: work_days; Type: TABLE DATA; Schema: public; Owner: john
--

COPY public.work_days (id, work_date, employee_id, total_duration) FROM stdin;
\.


--
-- Data for Name: work_sessions; Type: TABLE DATA; Schema: public; Owner: john
--

COPY public.work_sessions (id, work_day_id, start_time, end_time) FROM stdin;
\.


--
-- Data for Name: workplaces; Type: TABLE DATA; Schema: public; Owner: john
--

COPY public.workplaces (id, title, address) FROM stdin;
1	Test	test address
\.


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: john
--

SELECT pg_catalog.setval('public.employees_id_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: john
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: work_days_id_seq; Type: SEQUENCE SET; Schema: public; Owner: john
--

SELECT pg_catalog.setval('public.work_days_id_seq', 1, false);


--
-- Name: work_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: john
--

SELECT pg_catalog.setval('public.work_sessions_id_seq', 1, false);


--
-- Name: workplaces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: john
--

SELECT pg_catalog.setval('public.workplaces_id_seq', 1, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: employees employees_email_key; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_key UNIQUE (email);


--
-- Name: employees employees_personal_token_key; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_personal_token_key UNIQUE (personal_token);


--
-- Name: employees employees_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_phone_number_key UNIQUE (phone_number);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: work_days uq_employee_day; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.work_days
    ADD CONSTRAINT uq_employee_day UNIQUE (work_date, employee_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: work_days work_days_pkey; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.work_days
    ADD CONSTRAINT work_days_pkey PRIMARY KEY (id);


--
-- Name: work_sessions work_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.work_sessions
    ADD CONSTRAINT work_sessions_pkey PRIMARY KEY (id);


--
-- Name: workplaces workplaces_address_key; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.workplaces
    ADD CONSTRAINT workplaces_address_key UNIQUE (address);


--
-- Name: workplaces workplaces_pkey; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.workplaces
    ADD CONSTRAINT workplaces_pkey PRIMARY KEY (id);


--
-- Name: workplaces workplaces_title_key; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.workplaces
    ADD CONSTRAINT workplaces_title_key UNIQUE (title);


--
-- Name: employees employees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: employees employees_workplace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_workplace_id_fkey FOREIGN KEY (workplace_id) REFERENCES public.workplaces(id) ON DELETE RESTRICT;


--
-- Name: work_days work_days_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.work_days
    ADD CONSTRAINT work_days_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: work_sessions work_sessions_work_day_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.work_sessions
    ADD CONSTRAINT work_sessions_work_day_id_fkey FOREIGN KEY (work_day_id) REFERENCES public.work_days(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict kqylHkER740CksuJMTGwa4c3c7cNPYJOAvV6zKjfwij2Cs61xf8gV9Gh1Aim98x

