"""upgrade table for s3

Revision ID: 7d02396887fb
Revises: 397763fb176d
Create Date: 2023-04-26 08:37:28.381065

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7d02396887fb'
down_revision = '397763fb176d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('images', schema=None) as batch_op:
        batch_op.add_column(sa.Column('original_filename', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('filename', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('bucket', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('region', sa.String(length=100), nullable=True))
        batch_op.drop_constraint('images_img_key', type_='unique')
        batch_op.drop_column('name')
        batch_op.drop_column('mimetype')
        batch_op.drop_column('img')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('images', schema=None) as batch_op:
        batch_op.add_column(sa.Column('img', sa.VARCHAR(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('mimetype', sa.VARCHAR(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False))
        batch_op.create_unique_constraint('images_img_key', ['img'])
        batch_op.drop_column('region')
        batch_op.drop_column('bucket')
        batch_op.drop_column('filename')
        batch_op.drop_column('original_filename')

    # ### end Alembic commands ###