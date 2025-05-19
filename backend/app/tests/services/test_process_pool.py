import uuid
from unittest.mock import patch

import pytest
from app.services.boxed_service import BoxedService


class TestBoxedService:
    @pytest.fixture
    def process_service(self) -> BoxedService:
        return BoxedService()

    @patch("app.services.boxed_service.BoxedService.execute_code")
    async def test_execute(self, mock_execute_code, process_service: BoxedService):
        mock_execute_code.return_value = "exec_id"
        box_id = str(uuid.uuid4())
        code = "print('Hello, World!')"
        result = await process_service.exec_code(code, box_id)
        assert result == {
            "execution_id": "exec_id",
            "status": "pending",
            "result": None,
        }

    async def test_remove(self, process_service: BoxedService):
        box_id = await process_service.create_session()
        assert box_id in process_service.manager.proc_registry
        await process_service.destroy(box_id)
        assert box_id not in process_service.manager.proc_registry
