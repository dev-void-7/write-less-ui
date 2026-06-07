export function SpinnerLoader(props: {
    classList?: { [key: string]: boolean };
}) {
    return (
        <div
            class="wl--loader-spinner"
            classList={props.classList}
        ></div>
    );
}
