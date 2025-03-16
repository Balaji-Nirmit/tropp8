import {Link} from 'react-router-dom';
const HorizontalBar=({data})=>{
    return (
        <>
        <div className="w-full flex gap-4 items-center">
            <img className="h-[40px] rounded-4xl" src={data.img}></img>
            <div className="flex flex-col gap-1">
                <Link to={`/${data.name}`}>
                <h3 className="text-gray-700 font-medium text-md">@{data.name}</h3></Link>
                <p className="text-sm text-gray-400">{data.description}</p>
            </div>
        </div>
        </>
    )
}
export default HorizontalBar;