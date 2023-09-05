import { InputHTMLAttributes } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import classNames from 'classnames';
import { FieldErrors, Control, Controller } from 'react-hook-form';
import { useToggle } from 'hooks';
import Select, { ActionMeta } from "react-select";

type PasswordInputProps = {
    name: string;
    placeholder?: string;
    refCallback?: any;
    errors: FieldErrors;
    control?: Control<any>;
    register?: any;
    className?: string;
};

/* Password Input */
const PasswordInput = ({ name, placeholder, refCallback, errors, register, className }: PasswordInputProps) => {
    const [showPassword, togglePassword] = useToggle();

    return (
        <InputGroup className="mb-0">
            <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                name={name}
                id={name}
                as="input"
                ref={(r: HTMLInputElement) => {
                    if (refCallback) refCallback(r);
                }}
                className={className}
                isInvalid={errors && errors[name] ? true : false}
                {...(register ? register(name) : {})}
                autoComplete={name}
            />
            <div
                className={classNames('input-group-text', 'input-group-password', {
                    'show-password': showPassword,
                })}
                data-password={showPassword ? 'true' : 'false'}
            >
                <span className="password-eye" onClick={togglePassword}></span>
            </div>
        </InputGroup>
    );
};

export type MultipleSelectOptionProps = {
    value: string,
    label: string
}


type MultipleSelectProps = {
    name: string;
    placeholder?: string;
    options: MultipleSelectOptionProps[];
    control?: Control<any>;
    errors?: FieldErrors;
    onChange?: (updatedOption: MultipleSelectOptionProps, selected: boolean) => void;
}

/*MultiSelect Input*/
const MultipleSelect = ({ name, placeholder, options, control, errors, onChange }: MultipleSelectProps) => {
    const hasError = errors && errors["printIds"];
    let errorMessage = "";
    if (hasError) {
        errorMessage = errors["printIds"]['message'];
    }

    const handleSelectChange = (newValue: any, action: ActionMeta<any>) => {
        /*if (onChange) {
            if (action.action === 'remove-value') {
                onChange(action.removedValue, false);
            }
            if (action.action === 'select-option') {
                onChange(action.option, true);
            }
        }*/
    }

    return (
        <Controller
            control={control}
            name={name}
            render={({
                field: { onChange, onBlur, value, name, ref },
            }) => (
                <>
                <Select
                    placeholder={placeholder}
                    options={options}
                    isMulti={true}
                    id={name}
                    onChange={(newValue, actionMeta) => {
                        onChange(newValue);
                        handleSelectChange(newValue, actionMeta);
                    }}
                    onBlur={onBlur}
                    value={value}
                    name={name}
                    ref={ref}
                />
                {
                    hasError &&
                    <div className="invalid-feedback d-block">{errorMessage}</div>
                }
                </>
            )}
        />
    );

} 

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    type?: string;
    name: string;
    placeholder?: string;
    register?: any;
    errors?: FieldErrors;
    control?: Control<any>;
    className?: string;
    labelClassName?: string;
    containerClass?: string;
    refCallback?: any;
    children?: React.ReactNode;
    rows?: string;
    multiSelectOptions?: any[];
    multiSelectOnChange?: (newValue: MultipleSelectOptionProps, selected: boolean) => void;
};

const FormInput = ({
    label,
    type,
    name,
    placeholder,
    register,
    errors,
    control,
    className,
    labelClassName,
    containerClass,
    refCallback,
    children,
    rows,
    multiSelectOptions,
    multiSelectOnChange,
    ...otherProps
}: FormInputProps) => {
    // handle input type
    const comp = type === 'textarea' ? 'textarea' : type === 'select' ? 'select' : 'input';

    return (
        <>
            {type === 'hidden' ? (
                <input type={type} name={name} {...(register ? register(name) : {})} {...otherProps} />
            ) : (
                <>
                    {type === 'password' ? (
                        <>
                            <Form.Group className={containerClass}>
                                {label ? (
                                    <>
                                        {' '}
                                        <Form.Label className={labelClassName}>{label}</Form.Label> {children}{' '}
                                    </>
                                ) : null}
                                <PasswordInput
                                    name={name}
                                    placeholder={placeholder}
                                    refCallback={refCallback}
                                    errors={errors!}
                                    register={register}
                                    className={className}
                                />

                                {errors && errors[name] ? (
                                    <Form.Control.Feedback type="invalid" className="d-block">
                                        {errors[name]['message']}
                                    </Form.Control.Feedback>
                                ) : null}
                            </Form.Group>
                        </>
                    ) : (
                        <>
                            {type === 'select' ? (
                                <Form.Group className={containerClass}>
                                    {label ? <Form.Label className={labelClassName}>{label}</Form.Label> : null}

                                    <Form.Select
                                        type={type}
                                        label={label}
                                        name={name}
                                        id={name}
                                        ref={(r: HTMLInputElement) => {
                                            if (refCallback) refCallback(r);
                                        }}
                                        comp={comp}
                                        className={className}
                                        isInvalid={errors && errors[name] ? true : false}
                                        {...(register ? register(name) : {})}
                                        {...otherProps}
                                    >
                                        {children}
                                    </Form.Select>

                                    {errors && errors[name] ? (
                                        <Form.Control.Feedback type="invalid">
                                            {errors[name]['message']}
                                        </Form.Control.Feedback>
                                    ) : null}
                                </Form.Group>
                            ) : (
                                <>
                                    {type === 'checkbox' || type === 'radio' ? (
                                        <Form.Group className={containerClass}>
                                            <Form.Check
                                                type={type}
                                                label={label}
                                                name={name}
                                                id={name}
                                                ref={(r: HTMLInputElement) => {
                                                    if (refCallback) refCallback(r);
                                                }}
                                                className={className}
                                                isInvalid={errors && errors[name] ? true : false}
                                                {...(register ? register(name) : {})}
                                                {...otherProps}
                                            />

                                            {errors && errors[name] ? (
                                                <Form.Control.Feedback type="invalid">
                                                    {errors[name]['message']}
                                                </Form.Control.Feedback>
                                            ) : null}
                                        </Form.Group>
                                    ) : (                                                                
                                        <>
                                        { type === 'multipleselect' ?
                                        (
                                            <Form.Group className={containerClass}>
                                                {label ? <Form.Label className={labelClassName}>{label}</Form.Label> : null}     
                                                <MultipleSelect 
                                                    name={name}
                                                    placeholder={placeholder}
                                                    options={multiSelectOptions ? multiSelectOptions : []}
                                                    control={control}
                                                    errors={errors}
                                                    onChange={multiSelectOnChange}
                                                />
                                                {errors && errors[name] ? (
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors[name]['message']}
                                                    </Form.Control.Feedback>
                                                ) : null}
                                            </Form.Group>
                                        ) : (
                                        <Form.Group className={containerClass}>
                                            {label ? <Form.Label className={labelClassName}>{label}</Form.Label> : null}

                                            <Form.Control
                                                type={type}
                                                placeholder={placeholder}
                                                name={name}
                                                id={name}
                                                as={comp}
                                                ref={(r: HTMLInputElement) => {
                                                    if (refCallback) refCallback(r);
                                                }}
                                                className={className}
                                                isInvalid={errors && errors[name] ? true : false}
                                                {...(register ? register(name) : {})}
                                                {...otherProps}
                                                autoComplete={name}
                                            >
                                                {children ? children : null}
                                            </Form.Control>

                                            {errors && errors[name] ? (
                                                <Form.Control.Feedback type="invalid">
                                                    {errors[name]['message']}
                                                </Form.Control.Feedback>
                                            ) : null}
                                        </Form.Group>)
                                        }
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default FormInput;
