import { setInForm } from "@/lib/index";

export const PasswordToggler = ({ name, id, placeholder, form, setForm, state, setState }) => {
    return (
        <div className="passwordWrapper relative">
            <input
                className="rounded-full w-full p-3 border border-gray-300"
                type={state ? "password" : "text"}
                name={name}
                id={id}
                placeholder={placeholder}
                required
                onChange={ev => setInForm(ev, form, setForm)}
            />
            <div
                className="icon absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setState(!state)}
            >
                <i className={`fa-regular fa-eye${state ? '' : '-slash'}`}></i>
            </div>
        </div>
    );
};
