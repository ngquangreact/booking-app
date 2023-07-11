'use client';

import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import qs from "query-string";
import { formatISO } from "date-fns";
import useSearchModal from "@/app/hooks/useSearchModal";

import Modal from "./Modal"
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal = () => {
    const route = useRouter();
    const params = useSearchParams();

    const [step,setStep] = useState(STEPS.LOCATION);
    const [location,setLocation] = useState<CountrySelectValue>()
    const [guestCount,setGuestCount] = useState(1);
    const [roomCount,setRoomCount] = useState(1);
    const [bathroomCount,setBathroomCount] = useState(1);
    const [dateRange,setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    const Map = useMemo(() => dynamic(() => import('../Map'),{
        ssr: false
    }),[location]);

    const searchModal = useSearchModal();

    const onNext = useCallback(() => {
        setStep(value => value + 1)
    },[]);
    const onPrev = useCallback(() => {
        setStep(value => value - 1)
    },[]);

    const onSubmit = useCallback(() => {
        // Check step
        // if it is not the finaly step return next step
        if (step !== STEPS.INFO) {
            return onNext();
        };
        // If it is the finaly step then update query and redirect
        // init query
        let currentQuery = {};
        // get data on params
        if (params) {
            currentQuery = qs.parse(params.toString());
        };
        // get data from states
        const updateCurrentQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount
        };

        if (dateRange.startDate) {
            updateCurrentQuery.startDate = formatISO(dateRange.startDate);
        };
        if (dateRange.endDate) {
            updateCurrentQuery.endDate = formatISO(dateRange.endDate);
        };
        // pass query to url
        const url = qs.stringifyUrl({
            url: '/',
            query: updateCurrentQuery,
        },{skipNull: true});
        route.push(url);
        // close end reset search modal
        setStep(STEPS.LOCATION);
        searchModal.onClose();
    },[
        searchModal,
        step,
        location,
        guestCount,
        roomCount,
        bathroomCount,
        dateRange,
        params,
        route,
        onNext
    ]);

    const actionLabel = useMemo(() => {
        if (step === STEPS.INFO) {
            return 'Search';
        }
        return 'Next';
    },[step]);

    const secondActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined;
        }
        return 'Back';
    },[step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Where do you wanna go?"
                subtitle="Find the perfect location!"
            />
            <CountrySelect
                value={location}
                onChange={(value) => setLocation(value as CountrySelectValue)}
            />
            <hr />
            <Map
                center={location?.latlng} 
            />
        </div>
    )

    if (step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="When do you plan to go?"
                    subtitle="Make sure everyone is free!" 
                />
                <Calendar
                    value={dateRange}
                    onChange={value => setDateRange(value.selection)} 
                />
            </div>
        )
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="More information"
                    subtitle="Find your suitable place!" 
                />
                <Counter
                    title="Guests"
                    subtitle="How many guests are coming?"
                    value={guestCount}
                    onChange={value => setGuestCount(value)} 
                />
                <Counter
                    title="Rooms"
                    subtitle="How many rooms do you need?"
                    value={roomCount}
                    onChange={value => setRoomCount(value)} 
                />
                <Counter
                    title="Guests"
                    subtitle="How many bathrooms do you need?"
                    value={bathroomCount}
                    onChange={value => setBathroomCount(value)} 
                />
            </div>
        )
    }
    return (
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            title="Filter"
            actionLabel={actionLabel}
            secondaryActionLable={secondActionLabel}
            body={bodyContent}
            onSubmit={onSubmit}
            secondaryAction={step === STEPS.LOCATION ? undefined : onPrev}
        />
    )
}

export default SearchModal;