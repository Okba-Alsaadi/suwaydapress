'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css';

interface Props {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  dateFormat?: string;
  isClearable?: boolean;
  className?: string;
  locale?: string;
}

export default function CustomDatePicker({
  selected,
  onChange,
  placeholderText,
  dateFormat = 'yyyy/MM/dd',
  isClearable = true,
  className = '',
  locale,
}: Props) {
  return (
    <div className={`relative ${className}`}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText}
        dateFormat={dateFormat}
        isClearable={isClearable}
        locale={locale}
        showPopperArrow={false}
        className="w-full border border-greyish rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        wrapperClassName="w-full"
        popperClassName="custom-datepicker-popper"
        calendarClassName="custom-datepicker-calendar"
        dayClassName={(date) => 'custom-datepicker-day'}
        weekDayClassName={() => 'custom-datepicker-weekday'}
        monthClassName={() => 'custom-datepicker-month'}
      />
    </div>
  );
}