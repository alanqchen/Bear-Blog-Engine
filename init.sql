create schema post_schema
create schema user_schema

create table post_schema.post
(
	id serial not null,
	title text default 'Post' not null,
	slug text default '' not null,
	body text default '' not null,
	created_at timestamptz not null,
	updated_at timestamptz default null,
	tags text[] default '{}' not null,
	hidden boolean default true not null,
	authorid integer not null,
	feature_image_url text default '/assets/images/bear-art.png' not null,
	subtitle text default '' not null,
	views integer default 0 not null
);

create unique index post_id_uindex
	on post_schema.post (id);

create unique index post_slug_uindex
	on post_schema.post (slug);

alter table post_schema.post
	add constraint post_pk
		primary key (id);

create table user_schema."user"
(
	id integer not null,
	name text not null,
	email text not null,
	password text not null,
	admin boolean default false not null,
	created_at timestamptz not null,
	updated_at timestamptz default null
);

create unique index user_id_uindex
	on user_schema."user" (id);

alter table user_schema."user"
	add constraint user_pk
		primary key (id);
