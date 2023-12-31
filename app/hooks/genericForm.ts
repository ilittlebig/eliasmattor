import { useState, useCallback, useEffect, useRef } from 'react'
import deepEqual from '@/utils/deepEqual'

const useGenericForm = <T extends Record<string, any>>(initialState: T) => {
  const [formDetails, setFormDetails] = useState<T>(initialState);
  const [isFormValid, setFormValid] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const prevInitialStateRef = useRef<T>(initialState);

  const resetForm = () => {
    setFormDetails(initialState);
  };

  const resetIsChanged = () => {
    setIsChanged(false);
  };

  const isValueEqual = (value1: any, value2: any) => {
    const isBothNumber =
      typeof value1 === "number" &&
      typeof value2 === "number";
    const isEqual = isBothNumber ?
      value1 === value2 :
      String(value1).trim() === String(value2).trim();
    return isEqual;
  };

  const checkIfChanged = (newDetails: T): boolean => {
    if (!initialState) return false;
    return Object.keys(newDetails).some(key => {
      const initialValue = initialState[key as keyof T];
      const currentValue = newDetails[key as keyof T];
      return !isValueEqual(initialValue, currentValue);
    });
  };

  const handleFormChange = useCallback((fieldId: string, newValue: string) => {
    const numberFields = ["rating", "inventory", "price"];
    const value = numberFields.includes(fieldId) ? Number(newValue) : newValue;

    setFormDetails(prevDetails => {
      const newDetails = {
	...prevDetails,
	[fieldId]: value
      };

      const hasChanged = checkIfChanged(newDetails);
      setIsChanged(hasChanged);
      return newDetails;
    });
  }, [initialState]);

  const handleDropdownChange = useCallback((selection: string) => {
    setFormDetails(prevDetails => {
      const newDetails = {
	...prevDetails,
	category: selection
      };

      const hasChanged = checkIfChanged(newDetails);
      setIsChanged(hasChanged);
      return newDetails;
    });
  }, [initialState]);

  useEffect(() => {
    if (formDetails && typeof formDetails === "object") {
      const isValid = Object.values(formDetails).every(value => value !== "");
      setFormValid(isValid);
    } else {
      setFormValid(false);
    }
  }, [formDetails]);

  useEffect(() => {
    if (!deepEqual(prevInitialStateRef.current, initialState)) {
      setFormDetails(initialState);
      setIsChanged(false);
      prevInitialStateRef.current = initialState;
    }
  }, [initialState, deepEqual]);

  return {
    formDetails,
    resetForm,
    resetIsChanged,
    handleFormChange,
    handleDropdownChange,
    isFormValid,
    isChanged
  };
}

export default useGenericForm;
