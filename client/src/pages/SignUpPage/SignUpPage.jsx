import SignUpForm from "../../features/SignUpForm/SignUpForm";

export default function RegistrationPage({ setUser }) {
    return (
        <>
            <SignUpForm setUser={setUser} />
        </>
    );
}