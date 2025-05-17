'use client';
import React, { forwardRef } from 'react';
import { Info } from '@mui/icons-material';
import {
  Box,
  Input,
  Typography,
  Tooltip,
  InputAdornment,
  InputProps as MUIInputProps,
} from '@mui/material';

type Props = {
  label: string;
  required?: boolean;
  errorMessage?: string;
  infoText?: string | string[];
  icon?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & MUIInputProps;

const InputField = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    label,
    required,
    errorMessage,
    infoText,
    icon,
    value,
    onChange,
    ...inputProps
  } = props;

  const renderInfoText = () => {
    if (!infoText) return null;
    if (Array.isArray(infoText)) {
      return infoText.map((text, i) => (
        <Typography key={i} variant="body2">
          {text}
        </Typography>
      ));
    }
    return <Typography variant="body2">{infoText}</Typography>;
  };

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        boxShadow: '0px 4px 8px rgba(70, 95, 241, 0.10)',
        borderRadius: 2,
        p: 2,
        mb: 3,
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </Typography>
        {infoText && (
          <Tooltip title={renderInfoText()} arrow placement="top">
            <Info
              sx={{
                cursor: 'pointer',
                ml: 1,
                fontSize: 18,
                color: '#666',
              }}
            />
          </Tooltip>
        )}
      </Box>

      <Input
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label}`}
        disableUnderline
        fullWidth
        error={Boolean(errorMessage)}
        endAdornment={
          icon && <InputAdornment position="end">{icon}</InputAdornment>
        }
        sx={{
          fontSize: '1rem',
          fontWeight: 500,
          color: '#222',
          '::before, ::after': { borderBottom: 'none !important' },
          ':hover:not(.Mui-disabled):not(.Mui-error)::before': {
            borderBottom: 'none !important',
          },
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
            { display: 'none' },
          '& input[type=number]': { MozAppearance: 'textfield' },
        }}
        {...inputProps}
      />

      {errorMessage && (
        <Typography
          color="error"
          variant="caption"
          sx={{ mt: 1, display: 'block' }}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
});

InputField.displayName = 'InputField';
export default InputField;
