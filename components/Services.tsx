import { Card, CardHeader, CardTitle } from './ui/card';

const Services = ({
  setCompleteModel,
  setGetModel,
  setStartModel,
}) => {
  const team = [
    {
      title: 'Comp Shipment',
    },
    {
      title: 'Get Shipment',
    },
    {
      title: 'Start Shipment',
    }
  ];
  const openModelBox = (text) => {
    if (text === 1) {
      setCompleteModel(true);
    } else if (text === 2) {
      setGetModel(true);
    } else if (text === 3) {
      setStartModel(true);
    }
  };
  return (
    <section className='py-0 pb-14'>
      <div className='max-w-screen-xl mx-auto px-4 mb:px-8'>
        <div className='mt-12'>
          <ul className='grid gap-8 sm:grid-cols-2 md:grid-cols-3'>
            {team.map((item, i) => (
              <li key={i}>
                <div
                  onClick={() => openModelBox(i + 1)}
                  className='w-full h-60 sm:h-52 md:h-56'
                >
                  <Card className="h-[200px] flex items-center justify-center">
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Services