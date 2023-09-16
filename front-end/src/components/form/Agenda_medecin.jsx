
import React, { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import "./form.css";
import { useUserData } from "../../contexts/UserDataContext";
import { Week, Month,Day, TimelineViews, TimelineMonth, Agenda, ScheduleComponent, ResourcesDirective, ResourceDirective, ViewsDirective, ViewDirective, Inject } from '@syncfusion/ej2-react-schedule';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-buttons/styles/material.css';
import '@syncfusion/ej2-react-calendars/styles/material.css';
import '@syncfusion/ej2-react-dropdowns/styles/material.css';
import '@syncfusion/ej2-react-inputs/styles/material.css';
import '@syncfusion/ej2-react-popups/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';

function Agenda_medecin() {
    const {  agenda, userData } = useUserData();



    const eventSettings = { dataSource: agenda[userData.tel] }
    return (
        <ScheduleComponent
            width='100%'
            height='550px'
            margin='auto'
            selectedDate={new Date()}
            currentView='Month'
            eventSettings={eventSettings}
            >
            <ViewsDirective>
                <ViewDirective option='Week' />
                <ViewDirective option='Month' />
                <ViewDirective option='TimelineWeek' />
                <ViewDirective option='TimelineMonth' />
                <ViewDirective option='Agenda' />
            </ViewsDirective>
            <Inject services={[Week, Month, TimelineViews, TimelineMonth, Agenda,Day]} />
        </ScheduleComponent>
    );
}

export default Agenda_medecin;
