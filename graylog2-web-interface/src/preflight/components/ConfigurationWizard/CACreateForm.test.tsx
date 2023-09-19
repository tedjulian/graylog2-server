/*
 * Copyright (C) 2020 Graylog, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Server Side Public License, version 1,
 * as published by MongoDB, Inc.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Server Side Public License for more details.
 *
 * You should have received a copy of the Server Side Public License
 * along with this program. If not, see
 * <http://www.mongodb.com/licensing/server-side-public-license>.
 */
import React from 'react';
import { renderPreflight, screen, waitFor } from 'wrappedTestingLibrary';
import userEvent from '@testing-library/user-event';
import DefaultQueryClientProvider from 'DefaultQueryClientProvider';

import fetch from 'logic/rest/FetchProvider';
import UserNotification from 'preflight/util/UserNotification';
import { asMock } from 'helpers/mocking';

import CACreateForm from './CACreateForm';

jest.mock('logic/rest/FetchProvider', () => jest.fn());

jest.mock('preflight/util/UserNotification', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

const logger = {
  // eslint-disable-next-line no-console
  log: console.log,
  // eslint-disable-next-line no-console
  warn: console.warn,
  error: () => {},
};

describe('CACreateForm', () => {
  beforeEach(() => {
    asMock(fetch).mockReturnValue(Promise.resolve());
  });

  const submitForm = async () => {
    userEvent.click(await screen.findByRole('button', { name: /Create CA/i }));
  };

  it('should create CA', async () => {
    renderPreflight(<CACreateForm />);

    await submitForm();

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      'POST',
      expect.stringContaining('/api/ca/create'),
      {},
      false,
    ));

    expect(UserNotification.success).toHaveBeenCalledWith('CA created successfully');
  });

  it('should show error when CA creation fails', async () => {
    asMock(fetch).mockImplementation(() => Promise.reject(new Error('Error')));

    renderPreflight((
      <DefaultQueryClientProvider options={{ logger }}>
        <CACreateForm />
      </DefaultQueryClientProvider>
    ));

    await submitForm();

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      'POST',
      expect.stringContaining('/api/ca/create'),
      {},
      false,
    ));

    expect(UserNotification.error).toHaveBeenCalledWith('CA creation failed with error: Error: Error');
  });
});
