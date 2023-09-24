
import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import axios from "axios";
import "./form.css";
import { useUserData } from "../../contexts/UserDataContext";
import { fetchMedecinRdvs, fetchPatientRdvs, fetchRdvs } from "../fetchElement/fetchRdvs";
import { Week, Month, Day, WorkWeek, TimelineViews, TimelineMonth, Agenda, ScheduleComponent, Inject } from '@syncfusion/ej2-react-schedule';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-buttons/styles/material.css';
import '@syncfusion/ej2-react-calendars/styles/material.css';
import '@syncfusion/ej2-react-dropdowns/styles/material.css';
import '@syncfusion/ej2-react-inputs/styles/material.css';
import '@syncfusion/ej2-react-popups/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';
import Select from "react-select";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
import { useNavigate } from 'react-router-dom';


function Form_rdv() {
    const [dateDebutRdv, setDateDebutRdv] = useState();
    const [dateFinRdv, setDateFinRdv] = useState();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { updateRdvs, path, patient, medecins, userData, rdv, medecinRdvs, daysOff, doublons } = useUserData();
    const [bouton, setBouton] = useState("save");
    const [doctors, setDoctors] = useState();
    const [doctor, setDoctor] = useState();
    const [doctorSelected, setDoctorSelected] = useState()
    const [daysDisplay, setDaysDisplay] = useState(false)
    const [monthDisplay, setMonthDisplay] = useState(false)
    const [dateSelected, setDateSelected] = useState()
    const [eventSettings, setEventSettings] = useState([])
    const [eventSettingsOff, setEventSettingsOff] = useState([]);
    const [timesExclude, setTimeExclude] = useState([])
    const [selectedTimeSlot, setSelectedTimeSlot] = useState();
    const navigate = useNavigate();


    useEffect(() => {
        if (rdv) {
            setBouton("update")
            setDateDebutRdv(rdv.dateDebutRdv);
            setDateFinRdv(rdv.dateFinRdv);
        }
    }, [rdv])


    ////////////////////// soumission formulaire ////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dateDebutRdv) {
            setErrorMessage("Choose valid appointment date")
            return;
        }
        try {
            if (rdv) {
                try {
                    const token = localStorage.getItem('token');
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axios.put(
                        `${path}/api/rendez_vous/update/${rdv._id}`,
                        {
                            dateDebutRdv,
                            dateFinRdv,

                        }
                    );

                    if (response.status === 200) {
                        const rdv = response.data;
                        await fetchPatientRdvs(path, patient._id, updateRdvs)
                        console.log("update rdv done :", rdv);
                        setSuccessMessage("Updated successful!");
                        navigate('/dashboard/rdv');
                    }
                } catch (error) {
                    console.error("Erreur lors de l'enregistrement du rendez vous", error);
                    setErrorMessage("Error during updating. Please try again.");
                    setSuccessMessage("");

                }

            } else {
                try {
                    const token = localStorage.getItem('token');
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axios.post(
                        `${path}/api/rendez_vous/${patient._id}/${doctorSelected._id}`,
                        {
                            dateDebutRdv,
                            dateFinRdv,
                        }
                    );

                    if (response.status === 200) {
                        const rdv = response.data;

                        fetchPatientRdvs(path, patient._id, updateRdvs)

                        console.log("Nouveau rdv enregistré :", rdv);
                        setSuccessMessage("Registration successful!");
                        setErrorMessage("");
                        navigate('/dashboard/rdv');
                    }
                } catch (error) {
                    console.error("Erreur lors de l'enregistrement du rendez vous", error);
                    setErrorMessage(error.response.data.message);
                    setSuccessMessage("");

                }
            }
        } catch (error) {

        }
    };


    useEffect(() => {
        const fetchDoctors = async () => {
            const listDoctor = [];
            for (let medecin of medecins) {
                listDoctor.push({ value: `${medecin.tel}`, label: `${medecin.nom} ${medecin.prenom}` })
            }
            await setDoctors(listDoctor);
        };
        fetchDoctors();
    }, [medecins]);

    const handlerdoctorSelected = async (docSelected) => {
        for (let medecin of medecins) {
            if (medecin.tel == docSelected.value) {
                setEventSettingsOff(daysOff[medecin.tel])
                setEventSettings(medecinRdvs[medecin.tel])
                setDoctorSelected(medecin)
                setMonthDisplay(true)
                setDaysDisplay(false)
            }
        }
        console.log("eventSettings : ", eventSettings)
        console.log("eventSettingsOff : ", eventSettingsOff)
    }



    const handleCellClick = async (event, args) => {
        event.preventDefault();
        const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
        const ChooseDate = new Date(new Date(args).getFullYear(), new Date(args).getMonth(args), new Date(args).getDate()).getTime();
        console.log("times 1 : ", today, " times 2 : ", ChooseDate)
        if (ChooseDate < today) {
            alert("Please choose a valid date");
            return;
        }
        const formatDate2 = `${new Date(args).getFullYear()}${new Date(args).getMonth()}${new Date(args).getDate()}`
        setDateSelected(new Date(args))
        const excludeTimeList = []
        for (let day of eventSettings) {
            const formatDate1 = `${new Date(day.StartTime).getFullYear()}${new Date(day.StartTime).getMonth()}${new Date(day.StartTime).getDate()}`
            if (formatDate2 == formatDate1) {
                const formatTime = `${new Date(day.StartTime).getHours().toString().padStart(2, '0')}:${new Date(day.StartTime).getMinutes().toString().padStart(2, '0')}`
                excludeTimeList.push(formatTime)
            }
        }
        setTimeExclude(excludeTimeList)
        setDateSelected(args)
        setDaysDisplay(true)
        setMonthDisplay(false)
    };

    function MonthButtonGroup({ daysOff }) {
        const [daysOfMonth, setDaysOfMonth] = useState([]);
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        useEffect(() => {
            const today = new Date();
            const firstDayOfMonth = startOfMonth(today);
            const lastDayOfMonth = endOfMonth(today);
            const listDate = []
            const days = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
            for (let day of days) {
                const formatDay = `${new Date(day).getFullYear()}${new Date(day).getMonth()}${new Date(day).getDate()}`
                if (!daysOff.includes(formatDay)) {
                    listDate.push(day)
                }
                // console.log(formatDay)
            }
            setDaysOfMonth(listDate);
        }, []);

        return (
            <div className="button-container">
                <h2 className="day-title">DAYS OF THE MONTH ({monthNames[new Date().getMonth()]})</h2>
                <div className="button-group">
                    {daysOfMonth.map((day) => (
                        <button key={day} className="day-button" onClick={(event) => handleCellClick(event, day)}>
                            {format(day, "dd")}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    function generateTimeSlots() {
        const timeSlots = [];
        let currentHour = 6;
        let currentMinute = 0;
        while (currentHour <= 17 || (currentHour === 17 && currentMinute <= 30)) {
            const formattedHour = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            if (!timesExclude.includes(formattedHour)) {
                timeSlots.push(formattedHour);
            }
            currentMinute += 30;
            if (currentMinute === 60) {
                currentMinute = 0;
                currentHour += 1;
            }
        }

        return timeSlots;
    };

    function TimeSlotPicker() {
        const timeSlots = generateTimeSlots();

        const handleTimeSlotClick = async (event, timeSlot) => {
            event.preventDefault()
            const heure = timeSlot.split(':')
            await setSelectedTimeSlot(timeSlot);
            console.log("====> : ", heure)
            const formatDate = new Date(
                dateSelected.getFullYear(),
                dateSelected.getMonth(),
                dateSelected.getDate(),
                parseInt(heure[0]),
                parseInt(heure[1]))

            await setDateDebutRdv(formatDate)
            const formatDate2 = new Date(formatDate);
            await formatDate2.setMinutes(formatDate.getMinutes() + 30)
            await setDateFinRdv(formatDate2)

            console.log(selectedTimeSlot)
        };
        console.log("debut : ", dateDebutRdv, " Fin : ", dateFinRdv)
        return (
            <div className="hour-container">
                {/* <h2 className="hour-title">TIME SLOT</h2> */}
                <div>
                    {timeSlots.map((timeSlot, index) => (
                        <button
                            key={index}
                            onClick={(event) => handleTimeSlotClick(event, timeSlot)}
                            className={selectedTimeSlot === timeSlot ? 'selected' : 'notSelected'}
                        >
                            {timeSlot}
                        </button>
                    ))}
                </div>
                <p><span className="hour-selected">Selected timeslot : </span> {selectedTimeSlot || 'Aucun'}</p>
            </div>
        );
    };


    return (
        <div className="main-container-rdv">
            <form onSubmit={handleSubmit}>
                <div className=" rdv-container">
                    <div className="title-container">
                        <h2 className="title-rdv">APPOITMENT FORM</h2>
                    </div>
                    {successMessage && <p className="success-message" style={{ textAlign: 'center' }}>{successMessage}</p>}
                    {errorMessage && <p className="error-message" style={{ textAlign: 'center' }}>{errorMessage}</p>}
                    <div className="form-field">
                        <h4>Choose a Doctor </h4>
                        <Select
                            options={doctors}
                            value={doctor}
                            onChange={(selectedDoctor) => handlerdoctorSelected(selectedDoctor)}
                            isSearchable
                            placeholder="Select a doctor..."
                        />

                    </div>
                    <div className="form-field">
                        {/* {monthDisplay && <ScheduleComponent height="400px" currentView="Month" eventSettings={{ dataSource: eventSettingsOff, allowAdding: false, allowDeleting: false }} cellClick={handleCellClick}>
                        <Inject services={[Month]} />
                    </ScheduleComponent>} */}
                        {monthDisplay && <MonthButtonGroup daysOff={doublons[doctorSelected.tel]} />}
                    </div>
                    <div>
                        {/* {daysDisplay && <ScheduleComponent height="1300px" selectedDate={dateSelected} eventSettings={{ dataSource: eventSettings }} cellClick={handleCellClick2}>
                        <Inject services={[Day]} />
                    </ScheduleComponent>} */}
                        {daysDisplay && <TimeSlotPicker />}
                    </div>
                    <div className="form-field btn-rdv">
                        <Button id="sub_btn" type="submit">
                            {bouton}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Form_rdv;
