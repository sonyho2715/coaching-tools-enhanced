import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';

export default function AuthButton() {
  const { isSignedIn, user, isLoaded } = useUser();

  // Don't render anything while loading
  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  // If user is signed in, show user button with dropdown
  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3 px-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {user.firstName || user.emailAddresses[0].emailAddress}
        </span>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8"
            }
          }}
          afterSignOutUrl="/"
        />
      </div>
    );
  }

  // If user is not signed in, show sign in/sign up buttons
  return (
    <div className="flex items-center gap-2 px-4">
      <SignInButton mode="modal">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
          Đăng Nhập
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Đăng Ký
        </button>
      </SignUpButton>
    </div>
  );
}
