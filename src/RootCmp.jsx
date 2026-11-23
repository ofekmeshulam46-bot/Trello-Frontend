import { Routes, Route, useLocation } from "react-router"

import { HomePage } from "./pages/HomePage"
import { AboutUs, AboutTeam, AboutVision } from "./pages/AboutUs"
import { CarIndex } from "./pages/CarIndex.jsx"
import { ReviewIndex } from "./pages/ReviewIndex.jsx"
import { ChatApp } from "./pages/Chat.jsx"
import { AdminIndex } from "./pages/AdminIndex.jsx"

import { CarDetails } from "./pages/CarDetails"
import { UserDetails } from "./pages/UserDetails"

import { AppHeader } from "./cmps/AppHeader"
import { AppFooter } from "./cmps/AppFooter"
import { UserMsg } from "./cmps/UserMsg.jsx"
import { LoginSignup, Login, Signup } from "./pages/LoginSignup.jsx"
import { BoardIndex } from "./pages/Boardindex.jsx"
import { BoardDetails } from "./pages/BoardDetails.jsx"
import { TaskDetails } from "./pages/TaskDetails.jsx"

export function RootCmp() {
  const { pathname } = useLocation()
  const isBoardPage = pathname.startsWith("/board/")

  return (
    <div className={`main-container${isBoardPage ? " board-page" : ""}`}>
      {!isBoardPage && <AppHeader />}
      <UserMsg />

      <main className={isBoardPage ? "board-page-main" : ""}>
        <Routes>

          <Route path="board/:boardId" element={<BoardDetails />}>
             <Route path="task/:taskId" element={<TaskDetails />} />
          </Route>
         
          <Route path="boards" element={<BoardIndex />} />
          <Route path="" element={<HomePage />} />
          <Route path="about" element={<AboutUs />}>
            <Route path="team" element={<AboutTeam />} />
            <Route path="vision" element={<AboutVision />} />
          </Route>
          <Route path="car" element={<CarIndex />} />
          <Route path="car/:carId" element={<CarDetails />} />
          <Route path="user/:id" element={<UserDetails />} />
          <Route path="review" element={<ReviewIndex />} />
          <Route path="chat" element={<ChatApp />} />
          <Route path="admin" element={<AdminIndex />} />
          <Route path="auth" element={<LoginSignup />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />

          </Route>
        </Routes>
      </main>
      {!isBoardPage && <AppFooter />}
    </div>
  )
}
