import LoginContainer from "@/components/modules/auth/LoginContainer";

const Page = () => {
  return (
    <div className="bg-[url('/assets/auth-bg-01.png')] bg-cover bg-no-repeat h-screen w-full flex items-center justify-center">
      <LoginContainer />
    </div>
  );
};

export default Page;
