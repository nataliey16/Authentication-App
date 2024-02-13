import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}

// const PrivateRoute = () => {
//   const currentUser = useSelector((state) => state.user);
//   return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
//   //if there is a currentUser, show children (Outlet,)
//   //Show this:
//   //    <Route element={<PrivateRoute />}>
//   //      <Route path="/profile" element={<Profile />} />
//   //    </Route>;
//   //else show the sign-in
// };

// export default PrivateRoute;
