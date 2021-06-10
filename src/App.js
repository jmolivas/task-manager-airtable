import "./App.css";

import React, { useState } from "react";

import { ApolloProvider } from "@apollo/client/react";
import { ApolloTableQL } from "react-tableql";

import {
  ClerkProvider,
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import Switch from "react-switch";

import client from "./graphql/client";
import { USER_TASKS_QUERY, UPDATE_USER_TASK } from "./graphql/queries";

import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const { REACT_APP_CLERK_FRONTEND_API } = process.env;

function TimeTracker() {
  const user = useUser();
  const [date, setDate] = useState(new Date());
  const [today] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleDateChange = (e) => {
    setDate(e);
  };

  const CustomDatePicker = React.forwardRef(({ value, onClick }, ref) => (
    <button className="custom-date-picker" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  const handleUserTaskChange = (checked, id) => {
    const mutation = client.mutate({
      mutation: UPDATE_USER_TASK,
      variables: {
        userTaskId: id,
        completed: checked,
      },
    });

    mutation
      .then((result) => {
        // @TODO do something on success
      })
      .catch((error) => {
        // @TODO do something on error
      });
  };

  const columns = [
    "taskName",
    {
      id: "completed",
      component: (props) => (
        <Switch
          id={props.id}
          onChange={(e) => handleUserTaskChange(e, props.id)}
          checked={props.completed === true}
          disabled={today !== props.date}
        />
      ),
      customColumn: true,
    },
  ];

  return (
    <div className="App">
      <div className="grid-container">
        <div className="column left">
          <label>Date:</label>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            selected={date}
            onChange={handleDateChange}
            customInput={<CustomDatePicker />}
          />
        </div>
        <div className="column right">
          <div>
            Welcome <strong>{user.username} </strong>
          </div>
          <div>
            <UserButton />
          </div>
        </div>
      </div>

      <ApolloTableQL
        pollInterval={15000}
        columns={columns}
        query={USER_TASKS_QUERY}
        variables={{
          user: user.username,
          date: format(date, "yyyy-MM-dd"),
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ClerkProvider frontendApi={REACT_APP_CLERK_FRONTEND_API}>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <ApolloProvider client={client}>
          <TimeTracker />
        </ApolloProvider>
      </SignedIn>
    </ClerkProvider>
  );
}

export default App;
