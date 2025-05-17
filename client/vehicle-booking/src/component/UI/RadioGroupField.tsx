'use client';
import React, { forwardRef } from 'react';
import { Info } from '@mui/icons-material';
import {
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Tooltip,
  FormHelperText,
} from '@mui/material';

type Option = { label: string; value: string };

type Props = {
  label: string;
  options: Option[];
  required?: boolean;
  errorMessage?: string;
  infoText?: string | string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const RadioField = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    label,
    options,
    required,
    errorMessage,
    infoText,
    value,
    onChange,
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

      <RadioGroup
        ref={ref}
        row
        value={value}
        onChange={onChange}
      >
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio />}
            label={opt.label}
          />
        ))}
      </RadioGroup>

      {errorMessage && (
        <FormHelperText error sx={{ mt: 1 }}>
          {errorMessage}
        </FormHelperText>
      )}
    </Box>
  );
});

RadioField.displayName = 'RadioField';
export default RadioField;
