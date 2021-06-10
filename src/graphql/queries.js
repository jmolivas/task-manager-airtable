import gql from "graphql-tag";

const USER_TASKS_FRAGMENT = gql`
  fragment userTasks on userTasks {
    id
    taskName
    completed
    date
  }
`;

export const USER_TASKS_QUERY = gql`
  ${USER_TASKS_FRAGMENT}

  query userTasks($user: String, $date: String) {
    userTasks(
      _filter: { user: [$user], date: $date }

      _order_by: [{ taskWeight: "asc" }]
    ) {
      ...userTasks
    }
  }
`;

export const UPDATE_USER_TASK = gql`
  ${USER_TASKS_FRAGMENT}

  mutation updateUserTasks($userTaskId: String, $completed: Boolean) {
    update_userTasks(id: $userTaskId, completed: $completed) {
      ...userTasks
    }
  }
`;
