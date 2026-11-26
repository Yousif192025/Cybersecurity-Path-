REVOKE ALL ON FUNCTION enroll_student_in_path_courses() FROM PUBLIC;
REVOKE ALL ON FUNCTION enroll_student_in_path_courses() FROM codespace;
REVOKE ALL ON FUNCTION handle_student_linking() FROM PUBLIC;
REVOKE ALL ON FUNCTION handle_student_linking() FROM codespace;
GRANT EXECUTE ON FUNCTION enroll_student_in_path_courses() TO PUBLIC;
GRANT EXECUTE ON FUNCTION enroll_student_in_path_courses() TO codespace;
GRANT EXECUTE ON FUNCTION handle_student_linking() TO PUBLIC;
GRANT EXECUTE ON FUNCTION handle_student_linking() TO codespace;
