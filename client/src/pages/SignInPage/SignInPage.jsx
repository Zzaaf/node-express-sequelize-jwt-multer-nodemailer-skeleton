import SignInForm from "../../features/SignInForm/SignInForm";

export default function SignInPage({ setUser }) {
    return (
        <>
            <SignInForm setUser={setUser} />
        </>
    );
}