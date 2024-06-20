import {useParams} from "react-router-dom";
import {useSchema} from "../services/schema";
import {ItemForm} from "../components/itemForms/ItemForm";
import {deleteItem, updateItem, useItemData} from "../services/entity";
import {Divider} from "primereact/divider";
import {getLinkToEntity, getSubPageColumns, getWriteColumns} from "../utils/columnUtil";
import {Sublist} from "../containers/Sublist";
import {Button} from "primereact/button";
import {Subgrid} from "../containers/Subgrid";
import {userRequestStatus} from "../components/itemForms/userFormStatusUI";
import {fileUploadURL} from "../configs";
import {createInput} from "../components/itemForms/inputs/createInput";

export function DataItemPage() {
    const uploadUrl = fileUploadURL()
    const {schemaName, id} = useParams()
    const schema = useSchema(schemaName)
    const data = useItemData(schemaName, id)


    const columns = getWriteColumns(schema)
    const subPages = getSubPageColumns(schema)
    const formId = "editForm" + schemaName

    const {checkError, Status, confirm} = userRequestStatus(schemaName)


    const onSubmit = async (formData: any) => {
        formData[schema.dataKey] = id
        checkError((await updateItem(schemaName,formData)), 'Save Succeed')
    }

    const onDelete = async () => {
        confirm('Do you want to delete this item?',async () => {
            data[schema.dataKey] = id
            const res  =await deleteItem(schemaName,data)
            checkError(res, 'Delete Succeed')
            if (!res.err){
                await new Promise(r => setTimeout(r, 500));
                window.location.href= getLinkToEntity(schemaName??'', schemaName??'')
            }
        })
    }

    return schema && <>
        <Status/>
        <ItemForm {...{data, id, onSubmit, columns,formId,uploadUrl,  createInput}} />
        <Button type={'submit'} label={"Save " + schema.title} icon="pi pi-check" form={formId}/>
        {' '}
        <Button type={'button'} label={"Delete " + schema.title} severity="danger" onClick={onDelete}/>
        {
            subPages.map((column: any) => {
                const props = {schemaName, schema, data, column}
                return <div key={column.field}>
                    <Divider/>
                    { column.type === 'subgrid' && <Subgrid key={column.field} {...props}/> }
                    { column.type === 'sublist' && <Sublist key={column.field} {...props}/> }
                </div>
            })
        }
    </>
}