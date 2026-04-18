/**
 * Contact Form Submission Type
 */

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
  read: boolean;
};
