import React from "react";
import { Nav } from "shards-react";

import UserActions from "./UserActions";

export default () => (
  <Nav navbar className="flex-row">
    <UserActions />
  </Nav>
);
