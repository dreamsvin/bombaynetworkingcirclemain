-- RLS verification. Run: psql "$DB_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls.sql
-- Proves: anon can read published content, cannot read drafts, cannot read or write inquiries/subscribers,
-- and the consent constraint rejects publishing a story/testimonial without consented_on.
\set QUIET on
begin;

-- Fixtures (as owner)
insert into public.chapters (slug, city, state, is_published) values ('rls-pub', 'Pub City', 'MH', true), ('rls-draft', 'Draft City', 'MH', false);
insert into public.inquiries (type, name, email, message) values ('contact', 'RLS Test', 'rls@example.com', 'hello there');
insert into public.subscribers (email, source) values ('rls-sub@example.com', 'test');
insert into public.testimonials (author_name, quote, is_published) values ('Draft Person', 'Unconsented draft quote', false);

-- Consent constraint: these must fail.
do $$ begin
  begin
    insert into public.stories (slug, headline, body, is_published) values ('no-consent', 'x', 'body', true);
    raise exception 'FAIL: story published without consent was accepted';
  exception when check_violation then raise notice 'PASS: story without consented_on cannot publish';
  end;
  begin
    insert into public.testimonials (author_name, quote, is_published) values ('Nobody', 'This should never publish', true);
    raise exception 'FAIL: testimonial published without consent was accepted';
  exception when check_violation then raise notice 'PASS: testimonial without consented_on cannot publish';
  end;
  begin
    update public.testimonials set is_published = true where author_name = 'Draft Person';
    raise exception 'FAIL: flipping a draft testimonial to published without consent was accepted';
  exception when check_violation then raise notice 'PASS: draft testimonial cannot be flipped to published without consent';
  end;
end $$;

set local role anon;

do $$ declare n int; begin
  select count(*) into n from public.chapters where slug like 'rls-%';
  if n <> 1 then raise exception 'FAIL: anon saw % rls chapters (expected 1 published)', n; end if;
  raise notice 'PASS: anon reads published chapters only';

  select count(*) into n from public.testimonials where author_name = 'Draft Person';
  if n <> 0 then raise exception 'FAIL: anon can read unpublished testimonial'; end if;
  raise notice 'PASS: anon cannot read draft testimonials';

  begin
    perform 1 from public.inquiries limit 1;
    raise exception 'FAIL: anon can select from inquiries';
  exception when insufficient_privilege then raise notice 'PASS: anon cannot read inquiries';
  end;
  begin
    perform 1 from public.subscribers limit 1;
    raise exception 'FAIL: anon can select from subscribers';
  exception when insufficient_privilege then raise notice 'PASS: anon cannot read subscribers';
  end;
  begin
    perform 1 from public.access_requests limit 1;
    raise exception 'FAIL: anon can select from access_requests';
  exception when insufficient_privilege then raise notice 'PASS: anon cannot read access_requests';
  end;
  begin
    insert into public.access_requests (name, email, city, role, charter_agreed_at) values ('Anon', 'anon@example.com', 'Pune', 'Founder', now());
    raise exception 'FAIL: anon can insert into access_requests';
  exception when insufficient_privilege then raise notice 'PASS: anon cannot write access_requests';
  end;
  begin
    insert into public.inquiries (type, name, email) values ('contact', 'Anon', 'anon@example.com');
    raise exception 'FAIL: anon can insert into inquiries';
  exception when insufficient_privilege then raise notice 'PASS: anon cannot write inquiries';
  end;
  begin
    insert into public.chapters (slug, city, state) values ('anon-write', 'X', 'Y');
    raise exception 'FAIL: anon can insert chapters';
  exception when insufficient_privilege then raise notice 'PASS: anon cannot write content tables';
  end;
end $$;

reset role;
set local role authenticated;
do $$ begin
  begin
    perform 1 from public.inquiries limit 1;
    raise exception 'FAIL: authenticated can select from inquiries';
  exception when insufficient_privilege then raise notice 'PASS: authenticated cannot read inquiries';
  end;
  begin
    perform 1 from public.access_requests limit 1;
    raise exception 'FAIL: authenticated can select from access_requests';
  exception when insufficient_privilege then raise notice 'PASS: authenticated cannot read access_requests';
  end;
end $$;

reset role;
rollback;
\echo 'RLS suite complete.'
