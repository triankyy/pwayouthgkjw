import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserInterface } from '../interfaces/user.interface';
import { apiUrl } from '../utils/apiConstants';

export const userApi = createApi({
	reducerPath: 'users',
	baseQuery: fetchBaseQuery({ baseUrl: `${apiUrl}user/` }),
	tagTypes: ['Users'],
	endpoints: (builder) => ({
		getAll: builder.query<UserInterface[], void>({
			query: () => 'getAll',
			providesTags: (result) => result ? result.map(({id}) => ({ type: 'Users', id })) : [],
		}),
		getOne: builder.query<UserInterface, number>({
			query: (id) => `getOne/${id}`
		})
	})
});

export const { useGetAllQuery, useGetOneQuery } = userApi;