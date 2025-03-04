import './index.css'
import "@fontsource/sora";
import "@fontsource/lilita-one";
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'; 
import Layout from './Layout'
import ReactDOM from 'react-dom/client'
import authReducer from './slices/AuthState'
import StudentsHomepage from './pages/Students/StudentsHomepage'
import Homepage from './pages/main/Homepage'
import ClassEnrolment from './pages/Students/ClassEnrolment'
import ClaimReward from './pages/Students/ClaimReward';
import Leaderboards from './pages/Students/Leaderboards'
import MyRewards from './pages/Students/MyRewards';
import StudentInbox from './pages/Students/StudentInbox'
import Redemption from './pages/Students/Redemption'
import MyClass from './pages/Students/MyClass'
import ImageRecognition from './pages/Students/ImageRecognition'
import Login from './pages/Identity/Login'
import CreateAccount from './pages/Identity/CreateAccount'
import AccountRecovery from './pages/Identity/AccountRecovery'
import Dashboard from './pages/admin/landing'
import UserManagement from './pages/admin/user'
import InventoryManagement from './pages/admin/inventory'
import ContactFormManagement from './pages/admin/contact'
import EventsManagement from './pages/admin/events'
import ContactForm from './pages/contact/contact'
import EcoPilot from './pages/EcoPilot/EcoPilot'
import TeachersLanding from './pages/Teachers/Landing'
import Class from './pages/Teachers/Class'
import TaskVerification from './pages/Teachers/TaskVerification'
import ClassLeaderboards from './pages/Teachers/ClassLeaderboards'
import EmailVerification from './pages/Identity/EmailVerification'
import MyAccount from './pages/Identity/MyAccount'
import ParentsHomepage from './pages/parents/ParentsHomepage';
import EmailNewsletter from './pages/parents/EmailNewsletter';
import Faq from './pages/parents/Faq';
import PublicProfile from './pages/Identity/PublicProfile';
import MsAuth from './pages/Identity/MsAuth';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Lilita One', sans-serif` },
        body: { value: `'Sora', sans-serif` },
      },
    },
  },
})

const store = configureStore({
    reducer: {
        auth: authReducer
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <ChakraProvider value={system}>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Layout />} >
                        <Route index element={<Homepage />} />

                        <Route path={"student"}>
                            <Route path={"joinClass"} element={<ClassEnrolment />} />
                            <Route path={"claimReward"} element={<ClaimReward />} />
                            <Route path={"leaderboards"} element={<Leaderboards />} />
                            <Route path={"myClass"} element={<MyClass />} />
                            <Route path={"redemption"} element={<Redemption />} />
                            <Route path={"scanItem"} element={<ImageRecognition />} />
                            <Route path={"myRewards"} element={<MyRewards />} />
                            <Route path={"inbox"} element={<StudentInbox />} />
                            <Route path={"home"} element={<StudentsHomepage />} />
                        </Route>

                        <Route path={"auth"}>
                            <Route path={"login"} element={<Login />} />
                            <Route path={"createAccount"} element={<CreateAccount />} />
                            <Route path={"msAuth"} element={<MsAuth />} />
                            <Route path={"accountRecovery"} element={<AccountRecovery />} />
                            <Route path={"emailVerification"} element={<EmailVerification />} />
                        </Route>

                        <Route path={"identity"}>
                            <Route path={"myAccount"} element={<MyAccount />} />
                            <Route path={"publicProfile/:id"} element={<PublicProfile />} />
                        </Route>

                        <Route path={"admin"} >
                            <Route path={"dashboard"} element={<Dashboard />} />
                            <Route path={"userManagement"} element={<UserManagement />} />
                            <Route path={"inventoryManagement"} element={<InventoryManagement />} />
                            <Route path={"contactManagement"} element={<ContactFormManagement />} />
                            <Route path={"eventsManagement"} element={<EventsManagement />} />
                        </Route>

                        <Route path={"ecoPilot"} element={<EcoPilot />} />

                        <Route path={"contact"} element={<ContactForm />} />

                        <Route path={"teachers"}>
                            <Route index element={<TeachersLanding />} />
                            <Route path={"class/:id"} element={<Class />} />
                            <Route path={"tasks"} element={<TaskVerification />} /> 
                            <Route path={"classLeaderboards"} element={<ClassLeaderboards />} />
                        </Route>

                        <Route path="parents">
                            <Route index element={<ParentsHomepage />} />
                            <Route path="emailNewsletter" element={<EmailNewsletter />} />
                            <Route path="faq" element={<Faq />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </Provider>
)