"""changed text to string

Revision ID: 397763fb176d
Revises: fd4e1a5124b8
Create Date: 2023-04-25 11:15:35.954185

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '397763fb176d'
down_revision = 'fd4e1a5124b8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('images', schema=None) as batch_op:
        batch_op.alter_column('img',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
        batch_op.alter_column('name',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
        batch_op.alter_column('mimetype',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('images', schema=None) as batch_op:
        batch_op.alter_column('mimetype',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)
        batch_op.alter_column('name',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)
        batch_op.alter_column('img',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)

    # ### end Alembic commands ###
