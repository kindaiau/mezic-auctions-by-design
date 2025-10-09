-- Add DELETE policy for contact_submissions table
-- This allows admins to delete spam, test submissions, and honor GDPR deletion requests
-- The verify_admin_with_audit function ensures:
--   1. Only admin users can delete
--   2. All deletions are logged in audit_logs table
--   3. PII data is captured for compliance tracking

CREATE POLICY "Admins can delete contact submissions"
ON public.contact_submissions
FOR DELETE
TO authenticated
USING (
  verify_admin_with_audit(
    'DELETE'::text,
    'contact_submissions'::text,
    id,
    jsonb_build_object(
      'email', email,
      'phone', phone,
      'name', name,
      'ip_address', ip_address
    )
  )
);

-- Add helpful comment for future reference
COMMENT ON POLICY "Admins can delete contact submissions" ON public.contact_submissions IS 
'Allows admin users to delete contact form submissions for spam removal and GDPR compliance. All deletions are audited via verify_admin_with_audit function.';