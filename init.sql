CREATE TABLE IF NOT EXISTS public.users (
    id bigserial NOT NULL,
    username varchar NOT NULL,
    "isLogin" bool NOT NULL DEFAULT false,
    balance numeric(15, 2) NULL,
    "delFlag" bool NOT NULL DEFAULT false,
    "createdAt" timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TYPE public."transactionType" AS ENUM ('receive', 'transfer', 'topup');

CREATE TABLE IF NOT EXISTS public.transactions (
    id bigserial NOT NULL,
    "userId" int8 NULL,
    description text NULL,
    amount numeric(15, 2) NULL,
    type "transactionType",
    "delFlag" bool NOT NULL DEFAULT false,
    "createdAt" timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT transactions_pkey PRIMARY KEY (id)
);