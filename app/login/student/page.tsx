import AuthForm from '@/components/AuthForm';

import Link from 'next/link';

export default function StudentLogin() {
  return (
    <div>
      <AuthForm role="student" />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Have a Student ID?{' '}
          <Link href="/login/student-id" className="text-blue-600 hover:underline">
            Login with Student ID
          </Link>
        </p>
      </div>
    </div>
  );
}