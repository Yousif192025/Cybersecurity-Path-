CREATE OR REPLACE FUNCTION public.enroll_student_in_path_courses()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    target_path_id UUID;
BEGIN
    -- 1. العثور على الـ path_id بناءً على الـ track المختار من قبل الطالب
    -- نستخدم category في learning_paths للربط مع track في user_profile
    SELECT path_id INTO target_path_id 
    FROM public.learning_paths 
    WHERE category = NEW.track 
    LIMIT 1;

    -- 2. إذا تم العثور على مسار متطابق، نقوم بتسجيل الطالب في كل مواد هذا المسار
    IF target_path_id IS NOT NULL THEN
        INSERT INTO public.enrollments (user_id, course_id, completion_status)
        SELECT 
            NEW.user_id, -- المعرف الفريد للطالب الجديد
            pc.course_id, 
            'not_started' -- الحالة الافتراضية
        FROM public.path_course pc
        WHERE pc.path_id = target_path_id
        -- للتأكد من عدم تكرار التسجيل إذا كان السجل موجوداً مسبقاً
        ON CONFLICT (user_id, course_id) DO NOTHING; 
    END IF;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_student_linking()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.user_profile
  SET user_id = NEW.id
  WHERE TRIM(national_id) = TRIM(SPLIT_PART(NEW.email, '@', 1))
  AND user_id IS NULL;
  RETURN NEW;
END;
$function$
;

ALTER FUNCTION enroll_student_in_path_courses() OWNER TO codespace;
ALTER FUNCTION handle_student_linking() OWNER TO codespace;
