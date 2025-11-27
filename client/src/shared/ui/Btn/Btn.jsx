export default function Btn({ func, cursor, btnText }) {
    return (
        <button onClick={func} style={cursor && { cursor: 'pointer' }}>{btnText}</button>
    );
}