/**
 * Created by Barry Chen
 * 260952566
 */
const FormRow = ({ type, name, value, onChange, label, required = false, autoComplete = "on" }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {label || name} {required && '*'}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="form-input"
        autoComplete={autoComplete}
      />
    </div>
  );
};
export default FormRow;
