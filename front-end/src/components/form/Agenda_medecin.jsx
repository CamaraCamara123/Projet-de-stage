
import React, { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import "./form.css";
import { useUserData } from "../../contexts/UserDataContext";
import { Week, Month, TimelineViews, TimelineMonth, Agenda, ScheduleComponent, ResourcesDirective, ResourceDirective, ViewsDirective, ViewDirective, Inject } from '@syncfusion/ej2-react-schedule';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-buttons/styles/material.css';
import '@syncfusion/ej2-react-calendars/styles/material.css';
import '@syncfusion/ej2-react-dropdowns/styles/material.css';
import '@syncfusion/ej2-react-inputs/styles/material.css';
import '@syncfusion/ej2-react-popups/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';

function Agenda_medecin() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { doctor_agenda, agenda } = useUserData();

    useEffect(() => {
        setModalIsOpen(true)
        console.log(doctor_agenda)
    }, [doctor_agenda, agenda]);

    const handleCloseModal = () => {
        setModalIsOpen(false);
    }



    const eventSettings = { dataSource: agenda }
    const group = { allowGroupEdit: true, resources: ['RendezVous'] }
    return (
        <ScheduleComponent
            width='100%'
            height='550px'
            margin='auto'
            selectedDate={new Date()}
            currentView='TimelineWeek'
            eventSettings={eventSettings}
            group={group}>
            <ViewsDirective>
                <ViewDirective option='Week' />
                <ViewDirective option='Month' />
                <ViewDirective option='TimelineWeek' />
                <ViewDirective option='TimelineMonth' />
                <ViewDirective option='Agenda' />
            </ViewsDirective>
            <ResourcesDirective>
                <ResourceDirective
                    field='DoctorId'
                    title='Rendez-vous'
                    name='RendezVous'
                    allowMultiple={true}
                    dataSource={doctor_agenda}
                    textField='Text'
                    idField='Id'
                    colorField='Color'
                    workDaysField='IsWorkDay'
                >
                </ResourceDirective>
            </ResourcesDirective>
            <Inject services={[Week, Month, TimelineViews, TimelineMonth, Agenda]} />
        </ScheduleComponent>
    );
}

export default Agenda_medecin;
