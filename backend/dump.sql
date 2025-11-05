--
-- PostgreSQL database dump
--

\restrict LbTwRsArZWbg2HrXZl1cgYjaUuk5Vm09W3OUY3kj0qv0NTdb2U0xNSWpN91mAE0

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
-- Name: users; Type: TABLE; Schema: public; Owner: john
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying(100) NOT NULL,
    email character varying NOT NULL,
    password character varying(255) NOT NULL,
    is_active boolean NOT NULL,
    is_superuser boolean NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
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
-- Name: users id; Type: DEFAULT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: john
--

COPY public.alembic_version (version_num) FROM stdin;
e71c4b2cab2c
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: john
--

COPY public.users (id, full_name, email, password, is_active, is_superuser, created_at, updated_at) FROM stdin;
1	 Петренко Степан Віталійович	admin@admin.com	$argon2id$v=19$m=65536,t=3,p=4$REhp7R1DCAFASCkFYKw1Rg$8RcRqkvoylm5qcL3m48P4dCj/CHXlWDrqtxwo34DkL0	t	t	2025-11-05 09:20:46+00	2025-11-05 09:52:08.237588+00
3	Якимчук Олександр Сергійович	yakymchuk@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$5VzLWavVWitlrNU6R+jdOw$3vEdijc2vdlx4msmnTHHIXkszux5sU7dQr2NEEt+shc	t	f	2025-11-05 09:54:21+00	2025-11-05 09:56:01.7202+00
2	Пархомчук Віталій Сергійович	vitalikneloh@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$kvKeE+J8z/kf49z7vzfG2A$2GiB1dGYDza0MirUtXy+etF7WoGtg7AOrFZ4MlVMbcg	t	f	2025-11-05 02:05:00+00	2025-11-05 09:56:20.903565+00
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: john
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: john
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


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
-- PostgreSQL database dump complete
--

\unrestrict LbTwRsArZWbg2HrXZl1cgYjaUuk5Vm09W3OUY3kj0qv0NTdb2U0xNSWpN91mAE0

