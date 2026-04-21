import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

export const LoginForm = new FormGroup({
  username: new FormControl('', [Validators.required]),
  password: new FormControl('', [Validators.required]),
});


// ✅ Password Strength Validator (Tracks individual conditions)
function passwordStrengthValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value: string = control.value || '';
  if (!value) return null;

  return {
    minLength: value.length >= 8 ? null : "A minimum of 10 characters",
    hasUpperCase: /[A-Z]/.test(value) ? null : "At least one uppercase letter",
    hasLowerCase: /[a-z]/.test(value) ? null : "At least one lowercase letter",
    hasNumber: /[0-9]/.test(value) ? null : "Atleast one number",
  };
}
