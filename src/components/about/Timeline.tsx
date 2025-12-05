
interface TimelineItem {
    year: string;
    title: string;
    description: string;
}

const milestones: TimelineItem[] = [
    {
        year: "1963",
        title: "Early Life",
        description: "Born into a humble family in Rukum, Nepal, shaping his deep connection with the struggles of the common people."
    },
    {
        year: "1979",
        title: "Student Movement",
        description: "Entered politics through student unions, advocating for educational reforms and democracy."
    },
    {
        year: "1996",
        title: "People's War",
        description: "Played a pivotal leadership role in the insurgency aimed at ending feudalism and establishing a republic."
    },
    {
        year: "2008",
        title: "Constituent Assembly",
        description: "Elected to the Constituent Assembly, contributing significantly to drafting Nepal's new constitution."
    },
    {
        year: "2016",
        title: "Minister of Energy",
        description: "Led the 'Ujyalo Nepal' campaign, successfully ending years of chronic load-shedding."
    },
    {
        year: "2021",
        title: "Finance Minister",
        description: "Focused on economic revitalization and sustainable development policies."
    }
];

export function Timeline() {
    return (
        <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 md:ml-6 space-y-10 py-8">
            {milestones.map((item, index) => (
                <div key={index} className="mb-10 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {item.title} <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ml-3">{item.year}</span>
                    </h3>
                    <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                        {item.description}
                    </p>
                </div>
            ))}
        </div>
    );
}
