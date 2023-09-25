import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import {
  addNewData,
  deleteData,
  getDataFirestore,
  updateData,
} from '../firebase/firestore';

export const toDoApi = createApi({
  reducerPath: 'toDoApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['ToDo'],
  endpoints: builder => ({
    getData: builder.query({
      async queryFn() {
        try {
          const data = await getDataFirestore();
          return {data: data};
        } catch (error) {
          return {error};
        }
      },
      providesTags: ['ToDo'],
    }),
    createTodo: builder.mutation({
      async queryFn(data) {
        try {
          const response = await addNewData(data);
          return {data: response};
        } catch (error) {
          return {error};
        }
      },
      invalidatesTags: ['ToDo'],
    }),
    updateTodo: builder.mutation({
      async queryFn(data) {
        try {
          const response = await updateData(data);
          console.log(response);
          return {data: response};
        } catch (error) {
          console.log(error);
          return {error};
        }
      },
      invalidatesTags: ['ToDo'],
    }),
    deleteTodo: builder.mutation({
      async queryFn(id) {
        try {
          const response = await deleteData(id);
          console.log(response);
          return {data: response};
        } catch (error) {
          console.log(error);
          return {error};
        }
      },
      invalidatesTags: ['ToDo'],
    }),
  }),
});

export const {
  useGetDataQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = toDoApi;
