CREATE POLICY "Allow individual insert" ON public.enrollments AS PERMISSIVE FOR INSERT TO PUBLIC WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Allow users to enroll themselves" ON public.enrollments AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Allow users to update their own progress" ON public.enrollments AS PERMISSIVE FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Allow users to view their own enrollments" ON public.enrollments AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Enable all access for enrollments" ON public.enrollments AS PERMISSIVE FOR ALL TO PUBLIC USING (true) WITH CHECK (true);
CREATE POLICY "Students can view their own enrollments" ON public.enrollments AS PERMISSIVE FOR SELECT TO PUBLIC USING ((auth.uid() = user_id));
CREATE POLICY "Users can enroll themselves" ON public.enrollments AS PERMISSIVE FOR INSERT TO PUBLIC WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can view own enrollments" ON public.enrollments AS PERMISSIVE FOR SELECT TO PUBLIC USING ((auth.uid() = user_id));
CREATE POLICY "Admins have full access" ON public.user_profile AS PERMISSIVE FOR ALL TO PUBLIC USING ((( SELECT user_profile_1.role
   FROM user_profile user_profile_1
  WHERE (user_profile_1.user_id = auth.uid())) = 'admin'::text));
CREATE POLICY "Allow profile linking during signup" ON public.user_profile AS PERMISSIVE FOR SELECT TO authenticated USING (((user_id IS NULL) OR (auth.uid() = user_id)));
CREATE POLICY "Profiles are viewable by owners" ON public.user_profile AS PERMISSIVE FOR SELECT TO PUBLIC USING ((auth.uid() = user_id));
CREATE POLICY "Users can update own profile" ON public.user_profile AS PERMISSIVE FOR UPDATE TO PUBLIC USING ((auth.uid() = user_id));
CREATE POLICY "Users can update their own profiles" ON public.user_profile AS PERMISSIVE FOR UPDATE TO PUBLIC USING ((auth.uid() = user_id));
CREATE POLICY "Users can view and update own profile" ON public.user_profile AS PERMISSIVE FOR ALL TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can view own profile" ON public.user_profile AS PERMISSIVE FOR SELECT TO PUBLIC USING ((auth.uid() = user_id));
