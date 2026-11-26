CREATE TRIGGER trigger_enroll_on_new_profile AFTER INSERT ON user_profile FOR EACH ROW EXECUTE FUNCTION enroll_student_in_path_courses();
ALTER TABLE public.user_profile ENABLE TRIGGER trigger_enroll_on_new_profile;

