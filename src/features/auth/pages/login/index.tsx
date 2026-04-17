import BaseLayoutAuth from "../../components/BaseLayoutAuth";
import LoginFormSection from "../../components/loginFormSection";

export default async function LoginPage() {
  return (
    <BaseLayoutAuth>
      <LoginFormSection />
    </BaseLayoutAuth>
  );
}
