import React, {useState} from 'react';
import s from './CancelCancellationForm.module.css';
import Input from "../Input/Input";
import Button from "../Button/Button";
import Form from "react-bootstrap/Form";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {changeTaskStatus, getTask, getTaskHistory} from "../../store/slices/taskSlice";
import {useAuth} from "../../hooks/use-auth";

function CancelCancellationForm(props) {
    const dispatch = useDispatch();
    const user = useAuth();
    const [isLoading, setIsLoading] = useState(false);


    const onSubmit = (payload) => {
        if (!isLoading) {
            setIsLoading(true);
            dispatch(changeTaskStatus({
                id: props.taskID,
                nextStatus: "InWork",
                comment: payload.cancelCancellationComment,
                changeByUserId: user.id
            })).then(response => {
                dispatch(getTask(props.taskID))
                dispatch(getTaskHistory(props.taskID));
                props.setActive(false)
                if (!response.error)
                    toast.success('Отменение задачи успешно отклонено!', {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
            })
        }
    }

    return (
        <div className={s.authorizationForm}>
            <div>
                <p className={s.authorization}>Укажите причину отклонения отмены задачи</p>
                <Form className={s.form} onSubmit={props.handleSubmit(onSubmit)}>
                    <Input register={props.register}
                           registerName='cancelCancellationComment'
                           errors={props.errors}
                           options={
                               {
                                   required: {
                                       value: true,
                                       message: "Поле обязательно для ввода"
                                   },
                               }
                           }
                           type="text"
                           rows={2}
                           as="textarea"
                    />
                    <div className={s.buttons}>
                        <Button type="submit">Отправить</Button>
                        <Button isSecond click={() => {
                            props.setActive(false)
                            props.reset()
                        }}>Отменить</Button>
                    </div>

                </Form>
            </div>
        </div>
    )
}

export default CancelCancellationForm;
