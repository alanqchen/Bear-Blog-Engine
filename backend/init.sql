create schema post_schema;
create schema user_schema;

create table post_schema.post
(
	id integer not null,
	title text default 'Post' not null,
	slug text default '' not null,
	body text default '' not null,
	created_at timestamptz not null,
	updated_at timestamptz default null,
	tags text[] default '{}' not null,
	hidden boolean default true not null,
	authorid uuid not null,
	feature_image_url text default '/assets/images/default-image.png' not null,
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

create sequence post_schema.post_id_seq;

alter table post_schema.post alter column id set default nextval('post_schema.post_id_seq');

alter sequence post_schema.post_id_seq owned by post_schema.post.id;

create table user_schema."user"
(
	id uuid not null,
	name text not null,
	email text default '' not null,
	password text not null,
	admin boolean default false not null,
	created_at timestamptz not null,
	updated_at timestamptz default null,
	username text not null
);

create unique index user_id_uindex
	on user_schema."user" (id);

create unique index user_username_uindex
	on user_schema."user" (username);

alter table user_schema."user"
	add constraint user_pk
		primary key (id);

-- v2.0.0 changes
alter sequence post_schema.post_id_seq as integer;

alter table post_schema.post
    alter column authorid drop not null;

alter table post_schema.post
    alter column authorid set default null;

alter table post_schema.post
	add constraint user_fk
		foreign key (authorid)
			references user_schema."user"(id)
			on delete set default

alter table post_schema.post
    add featured bool default false;
    add published_at timestamptz default null;
	add category text default null;

create schema tag_schema;
create schema post_tag_schema;

create table tag_schema.tag
(
    id   serial
        constraint tag_pk
            primary key,
    name text default '' not null
);

create unique index tag_name_uindex
    on tag_schema.tag (name);
create unique index tag_id_uindex
    on tag_schema.tag (id);

create table post_tag_schema.post_tag
(
    id      int not null generated always as identity 
        constraint post_tag_pk
            primary key,
    post_id int not null
        constraint post_tag_post_id_fk
            references post_schema.post
            on delete cascade,
    tag_id  int not null
        constraint post_tag_tag_id_fk
            references tag_schema.tag
            on delete cascade
);
